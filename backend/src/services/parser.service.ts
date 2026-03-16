import axios, { AxiosError } from "axios";
import * as cheerio from "cheerio";
import { VacancyService } from "@/modules/vacancies/vacancy.service";
import { Search } from "@/modules/search/search.types";
import { logger } from "@/utils/log";

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
}

/**
 * Сервис для парсинга вакансий с hh.ru
 */
export class ParserService {
  private readonly HH_URL = "https://hh.ru";
  private readonly USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

  constructor(private readonly vacancyService: VacancyService) {
    this.vacancyService = vacancyService;
  }

  /**
   * Парсинг вакансий по параметрам поиска
   */
  async parseVacancies(search: Search): Promise<{
    newCount: number;
    totalCount: number;
  }> {
    try {
      const url = this.buildSearchUrl(search);
      logger.info(`[Parser] Начинаем парсинг для поиска "${search.title}" по URL: ${url}`);

      const response = await axios.get(url, {
        headers: {
          "User-Agent": this.USER_AGENT,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
        },
        timeout: 15000,
      });

      const $ = cheerio.load(response.data);
      const vacancies: ParsedVacancy[] = [];

      // Парсим вакансии - селекторы для hh.ru
      $("[data-qa='vacancy-serp__vacancy']").each((_, element) => {
        const vacancy = this.parseVacancyElement($, element);
        if (vacancy) {
          vacancies.push(vacancy);
        }
      });

      logger.info(`[Parser] Найдено ${vacancies.length} вакансий для поиска "${search.title}"`);

      // Фильтруем по excluded_text
      const filteredVacancies = this.filterByExcludedText(vacancies, search.excluded_text);
      logger.info(
        `[Parser] После фильтрации исключений осталось ${filteredVacancies.length} вакансий`,
      );

      // Сохраняем вакансии и считаем новые
      let newCount = 0;
      for (const vacancy of filteredVacancies) {
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
        );

        if (created) {
          newCount++;
        }
      }

      logger.info(
        `[Parser] Сохранено ${newCount} новых вакансий для поиска "${search.title}"`,
      );

      return {
        newCount,
        totalCount: filteredVacancies.length,
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
   * Парсинг одного элемента вакансии
   */
  private parseVacancyElement(
    $: cheerio.CheerioAPI,
    element: cheerio.Element,
  ): ParsedVacancy | null {
    try {
      const $element = $(element);

      // Извлекаем hhId из data-vacancy-id
      const hhId = $element.attr("data-vacancy-id") || null;
      if (!hhId) {
        return null;
      }

      // Заголовок вакансии
      const title =
        $element.find("[data-qa='vacancy-title']").text().trim() ||
        $element.find("a[data-qa='vacancy-title']").text().trim() ||
        "";

      // Ссылка на вакансию
      const url =
        $element.find("a[data-qa='vacancy-title']").attr("href") || "";
      const fullUrl = url.startsWith("http") ? url : `${this.HH_URL}${url}`;

      // Компания
      const company =
        $element.find("[data-qa='vacancy-company']").text().trim() || null;

      // Зарплата
      const salaryText = $element
        .find("[data-qa='vacancy-salary']")
        .text()
        .trim();
      const { salary, currency } = this.parseSalary(salaryText);

      // Описание (может быть в отдельном блоке)
      const description =
        $element.find("[data-qa='vacancy-serp__vacancy-description']").text().trim() || null;

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
      const maxSalary = numbers.length > 1 ? parseInt(numbers[1], 10) : minSalary;
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
   * Построение URL для поиска вакансий на hh.ru
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
      params.set("only_with_salary", "true");
    }

    // Регионы (area)
    search.area.forEach((areaId) => {
      params.append("area", areaId.toString());
    });

    // График работы (schedule)
    search.schedule.forEach((scheduleItem) => {
      params.append("schedule", scheduleItem);
    });

    // Тип занятости (employment)
    search.employment.forEach((employmentItem) => {
      params.append("employment", employmentItem);
    });

    // Опыт работы (experience)
    search.experience.forEach((experienceItem) => {
      params.append("experience", experienceItem);
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
}
