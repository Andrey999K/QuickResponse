import bcrypt from "bcrypt";
import { pool } from "./connection";

export async function seedUsers(saltRounds: number = 10): Promise<Record<string, number>> {
  const users = [
    { email: "alice@example.com", username: "alice123", password: "12345" },
    { email: "bob@example.com", username: "bob456", password: "12345" },
    { email: "charlie@example.com", username: "charlie789", password: "12345" },
    { email: "diana@example.com", username: "diana101", password: "12345" },
    { email: "evan@example.com", username: "evan202", password: "12345" },
    { email: "test@ma.co", username: "test", password: "qweqwe" },
  ];

  const userIds: Record<string, number> = {};

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    const result = await pool.query(
      `INSERT INTO users (email, username, password)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [user.email, user.username, hashedPassword]
    );
    if (result.rows.length > 0) {
      userIds[user.email] = result.rows[0].id;
    }
  }

  return userIds;
}

export async function seedSearches(userId: number): Promise<void> {
  if (!userId) return;

  const searches = [
    {
      title: "Java разработчик",
      keywords: "java, spring, postgres, sql",
      excluded_text: "стажер, junior",
      salary: 200000,
      currency: "RUR",
      only_with_salary: true,
      area: [61, 88], // Йошкар-Ола, Казань
      schedule: ["fullDay", "remote"],
      employment: ["FULL", "PART"],
      experience: ["between1And3", "between3And6"],
      cover_letter: "Имею опыт разработки на Java 5 лет",
      count_vacancies: 0,
      is_active: false,
    },
    {
      title: "Frontend разработчик React",
      keywords: "react, typescript, javascript",
      excluded_text: "",
      salary: 150000,
      currency: "RUR",
      only_with_salary: false,
      area: [61], // Йошкар-Ола
      schedule: ["fullDay", "flexible"],
      employment: ["FULL"],
      experience: ["between1And3"],
      cover_letter: null,
      count_vacancies: 0,
      is_active: false,
    },
    {
      title: "Python backend",
      keywords: "python, django, fastapi, api",
      excluded_text: "удалёнка",
      salary: 180000,
      currency: "RUR",
      only_with_salary: true,
      area: [88, 11958], // Казань, Руэм
      schedule: ["fullDay"],
      employment: ["FULL", "PART"],
      experience: ["noExperience", "between1And3"],
      cover_letter: "Разрабатываю на Python 3 года",
      count_vacancies: 0,
      is_active: false,
    },
  ];

  for (const search of searches) {
    await pool.query(
      `INSERT INTO searches (
         user_id, title, keywords, excluded_text, salary, currency,
         only_with_salary, area, schedule, employment, experience,
         cover_letter, count_vacancies, is_active
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        userId,
        search.title,
        search.keywords,
        search.excluded_text,
        search.salary,
        search.currency,
        search.only_with_salary,
        search.area,
        search.schedule,
        search.employment,
        search.experience,
        search.cover_letter,
        search.count_vacancies,
        search.is_active,
      ]
    );
  }
}
