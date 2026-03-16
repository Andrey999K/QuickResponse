import { areasMock } from "@/utils/areas";

/**
 * Получает название региона по ID
 */
export function getAreaNameById(id: string): string | undefined {
  return areasMock.data.find((area) => area.id === id)?.name;
}

/**
 * Получает названия регионов по массиву ID
 */
export function getAreaNamesByIds(ids: string[]): string[] {
  return ids.map((id) => getAreaNameById(id) || id);
}
