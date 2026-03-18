import axios, { AxiosError } from "axios";
import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import { VacancyService } from "@/modules/vacancies/vacancy.service";
import { Search } from "@/modules/search/search.types";
import { logger } from "@/utils/log";
import { NotificationService } from "@/modules/notifications/notification.service";
import { TelegramService } from "./telegram.service";
import { sseService } from "./sse.service";
import { pool } from "@/config/db/connection";
import { AIService } from "@/modules/ai/ai.service";

/**
 * Результат парсинга одной вакансии
 */
interface ParsedVacancy {
  hhId: string;
  title: string;
  company: string | null;
  salary: number | null;
  currency: string;
  url: string;
  area: number | null;
  schedule: string | null;
  employment: string | null;
  experience: string | null;
  description: string | null;
  coverLetter?: string | null;
}

/**
 * Сервис для парсинга вакансий с hh.ru
 */
export class ParserService {
  private readonly HH_URL = "https://m.hh.ru"; // Используем mobile версию
  private readonly USER_AGENT =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1";

  constructor(
    private readonly vacancyService: VacancyService,
    private readonly notificationService: NotificationService,
    private readonly telegramService: TelegramService,
    private readonly aiService: AIService,
  ) {}

  /**
   * Парсинг вакансий по параметрам поиска
   */
  async parseVacancies(search: Search): Promise<{
    newCount: number;
    totalCount: number;
  }> {
    try {
      const baseUrl = this.buildSearchUrl(search);
      logger.info(`[Parser] Начинаем парсинг для поиска "${search.title}" (ID: ${search.id})`);
      logger.info(`[Parser] Базовый URL: ${baseUrl}`);

      // Сначала получаем первую страницу, чтобы узнать общее количество вакансий
      const firstResponse = await axios.get(baseUrl, {
        headers: {
          "User-Agent": this.USER_AGENT,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
        },
        timeout: 15000,
      });

      const $ = cheerio.load(firstResponse.data);

      // Пытаемся найти общее количество вакансий
      // hh.ru обычно показывает что-то вроде "1 234 вакансии" или "Найдено 97 вакансий"
      const h1Text = $("h1").text();
      logger.info(`[Parser] H1 текст: "${h1Text}"`);
      
      const totalText = h1Text;
      const totalMatch = totalText.match(/(\d{1,3}(?:\s?\d{0,3})*)\s*(?:ваканси|вакансия|вакансий)/i);
      let estimatedTotal = 20; // По умолчанию

      if (totalMatch && totalMatch[1]) {
        estimatedTotal = parseInt(totalMatch[1].replace(/\s/g, ""), 10);
        logger.info(`[Parser] Найдено вакансий (по оценке hh.ru): ${estimatedTotal}`);
      } else {
        logger.warn(`[Parser] Не удалось найти количество вакансий в H1, используем значение по умолчанию: ${estimatedTotal}`);
      }

      // Вычисляем количество страниц (50 вакансий на странице на mobile.hh.ru)
      // Максимум 25 страниц для более полного парсинга (1250 вакансий)
      const maxPages = Math.min(Math.ceil(estimatedTotal / 50), 25);
      logger.info(`[Parser] Планируется страниц для парсинга: ${maxPages} (из ${Math.ceil(estimatedTotal / 50)})`);

      let totalCount = 0;
      const allNewVacancies: ParsedVacancy[] = [];

      // Парсим несколько страниц
      for (let page = 0; page < maxPages; page++) {
        const pageUrl = page === 0 ? baseUrl : `${baseUrl}&page=${page}`;

        try {
          const response = await axios.get(pageUrl, {
            headers: {
              "User-Agent": this.USER_AGENT,
              Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
            },
            timeout: 15000,
          });

          const $page = cheerio.load(response.data);
          const vacancies: ParsedVacancy[] = [];

          // 1. Парсим вакансии из вёрстки (mobile версия)
          $page("[data-qa='vacancy-serp__vacancy'], .vacancy, .vacancy-card").each((_, element) => {
            const vacancy = this.parseVacancyElement($page, element);
            if (vacancy) {
              vacancies.push(vacancy);
            }
          });

          // 2. Парсим вакансии из JSON данных (hh.ru хранит данные в script тегах)
          const jsonVacancies = this.parseVacanciesFromJson(response.data);

          // Добавляем вакансии из JSON, исключая дубликаты по hhId
          const existingIds = new Set(vacancies.map((v) => v.hhId));
          for (const jsonVacancy of jsonVacancies) {
            if (!existingIds.has(jsonVacancy.hhId)) {
              vacancies.push(jsonVacancy);
              existingIds.add(jsonVacancy.hhId);
            }
          }

          if (vacancies.length === 0) {
            break;
          }

          // Фильтруем по excluded_text
          const filteredVacancies = this.filterByExcludedText(vacancies, search.excluded_text);

          // Сохраняем вакансии и собираем новые
          // Генерируем AI сопроводительные письма только для первых 2 НОВЫХ вакансий
          let aiGeneratedCount = 0;
          const AI_GENERATION_LIMIT = 2;

          for (const vacancy of filteredVacancies) {
            // Сначала проверяем, существует ли уже такая вакансия
            const existing = await this.vacancyService.getVacancyByHhId(search.id, vacancy.hhId);

            if (existing) {
              // Вакансия уже есть в базе, пропускаем
              continue;
            }

            // Вакансия новая, генерируем сопроводительное письмо (если не превышен лимит)
            let coverLetter: string | null = null;
            if (aiGeneratedCount < AI_GENERATION_LIMIT) {
              try {
                logger.info(`[Parser] Генерация сопроводительного письма для вакансии "${vacancy.title}" (${aiGeneratedCount + 1}/${AI_GENERATION_LIMIT})`);

                coverLetter = await this.aiService.generateCoverLetter({
                  vacancyTitle: vacancy.title,
                  company: vacancy.company ?? null,
                  description: vacancy.description ?? null,
                  requirements: null,
                });

                aiGeneratedCount++;
                logger.info(`[Parser] Сопроводительное письмо сгенерировано (${coverLetter.length} символов)`);
              } catch (aiError) {
                logger.error(`[Parser] Ошибка генерации сопроводительного письма: ${(aiError as Error).message}`);
                // Продолжаем без письма, если AI упал
              }
            }

            // Создаём вакансию с сопроводительным письмом
            const created = await this.vacancyService.createVacancy(
              search.id,
              vacancy.hhId,
              vacancy.title,
              vacancy.company,
              vacancy.salary,
              vacancy.currency,
              vacancy.url,
              vacancy.area,
              vacancy.schedule,
              vacancy.employment,
              vacancy.experience,
              vacancy.description,
              coverLetter,
            );

            if (created) {
              allNewVacancies.push({ ...vacancy, coverLetter });
            }
          }

          totalCount += filteredVacancies.length;

          // Небольшая задержка между страницами (чтобы не блокировали)
          if (page < maxPages - 1) {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Увеличили задержку до 2 секунд
          }
        } catch (pageError) {
          const axiosError = pageError as AxiosError;
          logger.error(`[Parser] Ошибка при парсинге страницы ${page + 1}: ${axiosError.message}`);

          // Если это 429 (Too Many Requests), прекращаем парсинг
          if (axiosError.status === 429) {
            logger.warn(`[Parser] hh.ru блокирует запросы (429). Прекращаем парсинг после страницы ${page + 1}`);
            break;
          }

          // Продолжаем парсинг следующих страниц, если это не критическая ошибка
          logger.warn(`[Parser] Продолжаем парсинг следующей страницы...`);
        }
      }

      const newCount = allNewVacancies.length;
      logger.info(`[Parser] Завершено. Всего найдено: ${totalCount}, Новых: ${newCount}`);

      // Если есть новые вакансии — отправляем уведомление
      if (newCount > 0) {
        try {
          // Создаём in-app уведомление
          await this.notificationService.notifyNewVacancies(
            search.user_id,
            search.title,
            newCount,
          );

          // Отправляем SSE уведомление подключённым клиентам
          const notification = {
            id: Date.now(),
            title: `Новые вакансии по поиску "${search.title}"`,
            message: `Найдено ${newCount} новых вакансий`,
            type: 'vacancy' as const,
            created_at: new Date(),
          };
          sseService.sendNotification(search.user_id, notification);

          // Отправляем Telegram уведомление (если подключено)
          await this.sendTelegramNotification(search.user_id, search.title, allNewVacancies);

          logger.info(`[Parser] Уведомление отправлено пользователю ${search.user_id}`);
        } catch (notificationError) {
          logger.error(`[Parser] Ошибка отправки уведомления: ${(notificationError as Error).message}`);
        }
      }

      return {
        newCount,
        totalCount,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      logger.error(
        `[Parser] Ошибка парсинга для поиска "${search.title}": ${axiosError.message}`,
      );
      throw error;
    }
  }

  /**
   * Парсинг вакансий из JSON данных в HTML
   * hh.ru хранит данные о вакансиях в script тегах с type="application/json"
   */
  private parseVacanciesFromJson(html: string): ParsedVacancy[] {
    const vacancies: ParsedVacancy[] = [];

    // Ищем паттерн с данными о вакансиях в JSON формате
    // hh.ru использует формат: "vacancyId":12345,"name":"Название вакансии"
    const jsonPattern = /"vacancyId":(\d+),"name":"([^"]+)"/g;
    const matches = [...html.matchAll(jsonPattern)];

    for (const match of matches) {
      const hhId = match[1];
      const name = match[2]
        ? match[2].replace(/&quot;/g, '"').replace(/&amp;/g, "&")
        : "";

      if (!hhId || !name) continue;

      vacancies.push({
        hhId,
        title: name,
        company: null,
        salary: null,
        currency: "RUR",
        url: `https://hh.ru/vacancy/${hhId}`,
        area: null,
        schedule: null,
        employment: null,
        experience: null,
        description: null,
      });
    }

    return vacancies;
  }

  /**
   * Парсинг одного элемента вакансии
   */
  private parseVacancyElement(
    $: cheerio.CheerioAPI,
    element: AnyNode,
  ): ParsedVacancy | null {
    try {
      const $element = $(element);

      // Извлекаем hhId из data-vacancy-id или URL
      let hhId = $element.attr("data-vacancy-id");
      if (!hhId) {
        // Пытаемся извлечь ID из ссылки
        const url = $element.find("a").first().attr("href") || "";
        const match = url.match(/vacancy\/(\d+)/);
        if (match) {
          hhId = match[1];
        }
      }
      
      if (!hhId) {
        return null;
      }

      // Заголовок вакансии
      const title =
        $element.find("[data-qa='vacancy-title'], .vacancy-title, a").first().text().trim() || "";

      // Ссылка на вакансию
      const url = $element.find("a").first().attr("href") || "";
      const fullUrl = url.startsWith("http") ? url : `${this.HH_URL.replace("m.", "")}${url}`;

      // Компания
      const company =
        $element.find("[data-qa='vacancy-company'], .vacancy-company, .company").text().trim() || null;

      // Зарплата
      const salaryText = $element
        .find("[data-qa='vacancy-salary'], .vacancy-salary, .salary")
        .text()
        .trim();
      const { salary, currency } = this.parseSalary(salaryText);

      // Описание (может быть в отдельном блоке)
      const description =
        $element.find("[data-qa='vacancy-serp__vacancy-description'], .vacancy-description, .description").text().trim() || null;

      // Местоположение (area) - пока null, можно распарсить позже
      const area = null;

      // График и тип занятости - пока null, можно распарсить позже
      const schedule = null;
      const employment = null;
      const experience = null;

      return {
        hhId,
        title,
        company,
        salary,
        currency,
        url: fullUrl,
        area,
        schedule,
        employment,
        experience,
        description,
      };
    } catch (error) {
      logger.error(`[Parser] Ошибка при парсинге элемента вакансии: ${(error as Error).message}`);
      return null;
    }
  }

  /**
   * Парсинг зарплаты из текста
   */
  private parseSalary(salaryText: string): { salary: number | null; currency: string } {
    if (!salaryText) {
      return { salary: null, currency: "RUR" };
    }

    // Извлекаем числа из строки типа "от 100 000 до 150 000 руб."
    const numbers = salaryText.replace(/\s/g, "").match(/\d+/g);
    let salary: number | null = null;

    if (numbers && numbers.length > 0) {
      // Берём среднее между min и max если указано
      const minSalary = parseInt(numbers[0], 10);
      const maxSalary = numbers.length > 1 ? parseInt(numbers[1]!, 10) : minSalary;
      salary = Math.round((minSalary + maxSalary) / 2);
    }

    // Определяем валюту
    let currency = "RUR";
    if (salaryText.toLowerCase().includes("usd") || salaryText.includes("$")) {
      currency = "USD";
    } else if (salaryText.toLowerCase().includes("eur") || salaryText.includes("€")) {
      currency = "EUR";
    } else if (salaryText.toLowerCase().includes("kzt")) {
      currency = "KZT";
    } else if (salaryText.toLowerCase().includes("byn")) {
      currency = "BYN";
    }

    return { salary, currency };
  }

  /**
   * Фильтрация вакансий по excluded_text
   */
  private filterByExcludedText(
    vacancies: ParsedVacancy[],
    excludedText: string | null,
  ): ParsedVacancy[] {
    if (!excludedText) {
      return vacancies;
    }

    const excludedWords = excludedText
      .toLowerCase()
      .split(",")
      .map((word) => word.trim())
      .filter((word) => word.length > 0);

    return vacancies.filter((vacancy) => {
      const textToCheck = `${vacancy.title} ${vacancy.company || ""}`.toLowerCase();
      return !excludedWords.some((word) => textToCheck.includes(word));
    });
  }

  /**
   * Построение URL для поиска вакансий на hh.ru (mobile версия)
   */
  private buildSearchUrl(search: Search): string {
    const params = new URLSearchParams();

    // Текст поиска (keywords)
    if (search.keywords) {
      params.set("text", search.keywords);
    }

    // Зарплата
    if (search.salary) {
      params.set("salary", search.salary.toString());
    }

    // Регионы (area)
    search.area.forEach((areaId) => {
      params.append("area", areaId.toString());
    });

    // График работы (schedule) - маппинг для hh.ru
    search.schedule.forEach((scheduleItem) => {
      params.append("schedule", ParserService.mapScheduleToHh(scheduleItem));
    });

    // Тип занятости (employment) - маппинг для hh.ru
    search.employment.forEach((employmentItem) => {
      params.append("employment", ParserService.mapEmploymentToHh(employmentItem));
    });

    // Опыт работы (experience) - маппинг для hh.ru
    search.experience.forEach((experienceItem) => {
      params.append("experience", ParserService.mapExperienceToHh(experienceItem));
    });

    // Дата публикации вакансии (freshness)
    params.set("date", "1"); // За последние 1 день

    return `${this.HH_URL}/search/vacancy?${params.toString()}`;
  }

  /**
   * Маппинг строковых значений в параметры hh.ru
   */
  static mapScheduleToHh(schedule: string): string {
    const mapping: Record<string, string> = {
      full_day: "fullDay",
      shift: "shift",
      flexible: "flexible",
      remote: "remote",
      rotational: "rotational",
    };
    return mapping[schedule] || schedule;
  }

  static mapEmploymentToHh(employment: string): string {
    const mapping: Record<string, string> = {
      full: "full",
      part: "part",
      internship: "internship",
      probation: "probation",
      project: "project",
    };
    return mapping[employment] || employment;
  }

  static mapExperienceToHh(experience: string): string {
    const mapping: Record<string, string> = {
      no_experience: "noExperience",
      between_1_and_3: "between1And3",
      between_3_and_6: "between3And6",
      more_than_6: "moreThan6",
    };
    return mapping[experience] || experience;
  }

  /**
   * Отправить Telegram уведомление пользователю
   * Отправляет ОТДЕЛЬНОЕ сообщение на каждую вакансию
   */
  private async sendTelegramNotification(
    userId: number,
    searchTitle: string,
    newVacancies: ParsedVacancy[],
  ): Promise<void> {
    try {
      // Получаем пользователя из БД
      const userResult = await pool.query({
        text: `
          SELECT telegram_id, telegram_notifications_enabled
          FROM users
          WHERE id = $1
        `,
        values: [userId],
      });

      const user = userResult.rows[0];

      if (!user || !user.telegram_id || !user.telegram_notifications_enabled) {
        logger.debug(`[Parser] Telegram уведомления не подключены для пользователя ${userId}`);
        return;
      }

      // Отправляем отдельное сообщение для каждой вакансии
      for (const vacancy of newVacancies) {
        await this.telegramService.sendVacancyMessage(
          user.telegram_id,
          searchTitle,
          vacancy,
        );
      }
    } catch (error) {
      logger.error(`[Parser] Ошибка отправки Telegram уведомления: ${(error as Error).message}`);
    }
  }
}
