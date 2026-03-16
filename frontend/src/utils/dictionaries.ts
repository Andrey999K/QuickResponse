export interface Schedule {
  id: string;
  name: string;
  uid: string;
}

export interface Employment {
  id: string;
  name: string;
  duration: string;
}

export interface Experience {
  id: string;
  name: string;
}

export const schedules: Schedule[] = [
  { id: "fullDay", name: "Полный день", uid: "full_day" },
  { id: "shift", name: "Сменный график", uid: "shift" },
  { id: "flexible", name: "Гибкий график", uid: "flexible" },
  { id: "remote", name: "Удаленная работа", uid: "remote" },
  { id: "flyInFlyOut", name: "Вахтовый метод", uid: "fly_in_fly_out" },
];

export const employments: Employment[] = [
  { id: "FULL", name: "Полная", duration: "PERMANENT" },
  { id: "PART", name: "Частичная", duration: "PERMANENT" },
  { id: "PROJECT", name: "Проект", duration: "TEMPORARY" },
  { id: "FLY_IN_FLY_OUT", name: "Вахта", duration: "PERMANENT" },
  { id: "SIDE_JOB", name: "Подработка", duration: "TEMPORARY" },
];

export const experiences: Experience[] = [
  { id: "noExperience", name: "Нет опыта" },
  { id: "between1And3", name: "От 1 года до 3 лет" },
  { id: "between3And6", name: "От 3 до 6 лет" },
  { id: "moreThan6", name: "Более 6 лет" },
];

/**
 * Получает название графика работы по ID
 */
export function getScheduleNameById(id: string): string | undefined {
  return schedules.find((s) => s.id === id)?.name;
}

/**
 * Получает название опыта работы по ID
 */
export function getExperienceNameById(id: string): string | undefined {
  return experiences.find((e) => e.id === id)?.name;
}

/**
 * Получает названия графиков работы по массиву ID
 */
export function getScheduleNamesByIds(ids: string[]): string[] {
  return ids.map((id) => getScheduleNameById(id) || id);
}

/**
 * Получает названия опытов работы по массиву ID
 */
export function getExperienceNamesByIds(ids: string[]): string[] {
  return ids.map((id) => getExperienceNameById(id) || id);
}
