/**
 * Тестовый скрипт для проверки парсера hh.ru
 * Запуск: yarn tsx src/scripts/test-parser.ts
 */

import axios from "axios";
import * as cheerio from "cheerio";
import { logger } from "@/utils/log";

async function testParser() {
  // Пробуем mobile версию hh.ru - она проще
  const searchUrl = `https://m.hh.ru/search/vacancy?text=frontend+react&area=1`;

  logger.info(`[Test] Запрос к hh.ru (mobile): ${searchUrl}`);

  try {
    const response = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
      },
      timeout: 15000,
    });

    logger.info(`[Test] Статус ответа: ${response.status}`);
    logger.info(`[Test] Длина HTML: ${response.data.length} символов`);

    const $ = cheerio.load(response.data);

    // Проверяем, есть ли вакансии - пробуем разные селекторы для mobile
    const vacancyElements = $("[data-qa='vacancy-serp__vacancy'], .vacancy, .vacancy-card, [data-testid='vacancy-item'], article");
    logger.info(`[Test] Найдено вакансий: ${vacancyElements.length}`);

    if (vacancyElements.length === 0) {
      logger.warn("[Test] Вакансии не найдены! Возможно, селекторы устарели или hh.ru блокирует запрос.");
      
      // Выводим заголовок страницы для отладки
      const pageTitle = $("title").text();
      logger.info(`[Test] Заголовок страницы: ${pageTitle}`);
      
      // Пробуем найти любые элементы с классами
      const allClasses: string[] = [];
      $("[class]").each((_, el) => {
        const className = $(el).attr("class");
        if (className && (className.includes("vacancy") || className.includes("search"))) {
          allClasses.push(className);
        }
      });
      logger.info(`[Test] Найденные классы: ${allClasses.slice(0, 10).join(", ")}`);
    }

    // Парсим первую вакансию для проверки
    if (vacancyElements.length > 0) {
      const firstVacancy = $(vacancyElements[0]);
      
      const hhId = firstVacancy.attr("data-vacancy-id") || firstVacancy.attr("data-qa") || null;
      const title = firstVacancy.find("[data-qa='vacancy-title'], .vacancy-title, a").first().text().trim();
      const company = firstVacancy.find("[data-qa='vacancy-company'], .vacancy-company").text().trim() || null;
      const salary = firstVacancy.find("[data-qa='vacancy-salary'], .vacancy-salary").text().trim() || null;
      const url = firstVacancy.find("a").first().attr("href") || "";
      const fullUrl = url?.startsWith("http") ? url : `https://m.hh.ru${url}`;

      logger.info("[Test] Данные первой вакансии:");
      logger.info(`  - HH ID: ${hhId}`);
      logger.info(`  - Title: ${title}`);
      logger.info(`  - Company: ${company}`);
      logger.info(`  - Salary: ${salary}`);
      logger.info(`  - URL: ${fullUrl}`);
    }

    // Сохраняем HTML для отладки
    const fs = await import("fs");
    const path = await import("path");
    const outputPath = path.join(process.cwd(), "logs", "hh-test.html");
    fs.writeFileSync(outputPath, response.data);
    logger.info(`[Test] HTML сохранён в: ${outputPath}`);

    logger.info("[Test] Тест завершён успешно!");
  } catch (error) {
    const axiosError = error as Error & { code?: string; status?: number };
    logger.error(`[Test] Ошибка: ${axiosError.message}`);
    
    if (axiosError.code === "ECONNABORTED") {
      logger.error("[Test] Таймаут запроса - hh.ru может блокировать запросы");
    } else if (axiosError.status === 403) {
      logger.error("[Test] Доступ запрещён (403) - нужна авторизация или proxy");
    } else if (axiosError.status === 429) {
      logger.error("[Test] Слишком много запросов (429) - нужно увеличить интервал");
    }
  }
}

// Запуск теста
testParser();
