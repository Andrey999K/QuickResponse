/**
 * Форматирует дату в формат "ДД.ММ.ГГГГ ЧЧ:ММ" (московское время)
 */
export function formatDateTime(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Конвертируем в московское время (UTC+3)
  const moscowTime = new Date(date.toLocaleString("en-US", { timeZone: "Europe/Moscow" }));

  const day = String(moscowTime.getDate()).padStart(2, "0");
  const month = String(moscowTime.getMonth() + 1).padStart(2, "0");
  const year = moscowTime.getFullYear();
  const hours = String(moscowTime.getHours()).padStart(2, "0");
  const minutes = String(moscowTime.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
