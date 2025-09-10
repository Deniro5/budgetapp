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

export function getNextSemiMonthlyDate(currentDateStr: string): string {
  const dateOnly = currentDateStr.split("T")[0];
  const [yStr, mStr, dStr] = dateOnly.split("-");
  const year = parseInt(yStr, 10);
  const monthIndex = parseInt(mStr, 10) - 1;
  const day = parseInt(dStr, 10);

  const pad = (n: number) => (n < 10 ? "0" + n : String(n));

  const lastDayOfThisMonth = new Date(year, monthIndex + 1, 0).getDate();

  if (day < 15) {
    return `${year}-${pad(monthIndex + 1)}-15`;
  } else if (day < lastDayOfThisMonth) {
    return `${year}-${pad(monthIndex + 1)}-${pad(lastDayOfThisMonth)}`;
  } else {
    const nextMonthDate = new Date(year, monthIndex + 1, 15);
    return `${nextMonthDate.getFullYear()}-${pad(
      nextMonthDate.getMonth() + 1
    )}-${pad(nextMonthDate.getDate())}`;
  }
}
