import { areasMock } from '@/mock';

const areasMap = new Map(
  areasMock.data.map(area => [area.id, area.name])
);

export function getAreaNamesByIds(areaIds: string[]): string[] {
  return areaIds
    .map(id => areasMap.get(id) || `ID: ${id}`)
    .filter(Boolean) as string[];
}

export function getAreaNameById(id: string): string | undefined {
  return areasMap.get(id);
}
