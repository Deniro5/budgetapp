export function addOneDay(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day); // month is 0-based
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

export function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}
