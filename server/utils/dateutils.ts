export function addOneDay(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

export function addOneWeek(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + 7);
  return date.toISOString().split("T")[0];
}

export function addTwoWeeks(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + 14);
  return date.toISOString().split("T")[0];
}

export function addOneMonth(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().split("T")[0];
}

export function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}
