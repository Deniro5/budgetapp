export function getFirstDayOfMonthFormatted() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  return firstDay.toISOString().split("T")[0]; // Outputs: "YYYY-MM-01"
}

export function getLastDayOfMonthFormatted() {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.toISOString().split("T")[0]; // Outputs: "YYYY-MM-DD"
}

export function getFirstDayOfYearFormatted() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), 0, 1);
  return firstDay.toISOString().split("T")[0]; // Outputs: "YYYY-01-01"
}

export function getLastDayOfYearFormatted() {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), 11, 31);
  return lastDay.toISOString().split("T")[0]; // Outputs: "YYYY-12-31"
}

export function dateToFormattedString(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US").format(date); // mm/dd/yyyy format
}

export function parseDate(value: string): Date | null {
  const [month, day, year] = value.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  return !isNaN(date.getTime()) ? date : null;
}

export function getCurrentDateFormatted() {
  return new Date().toISOString().split("T")[0];
}

export function getDateDaysAgoFormatted(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days + 1);
  return date.toISOString().split("T")[0];
}

export function formatDateToYYYYMMDD(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isStartAndEndOfSameMonth(start: Date, end: Date) {
  const isStartFirstDay = start.getDate() === 1;
  const lastDayOfMonth = new Date(
    end.getFullYear(),
    end.getMonth() + 1,
    0
  ).getDate();
  const isEndLastDay = end.getDate() === lastDayOfMonth;

  return (
    isStartFirstDay &&
    isEndLastDay &&
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth()
  );
}

function parseYMDDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day); // Month is 0-based
}
//takes a monthly value and gets a new value for a date range based on the average daily value
export function getAggregatedValue(
  startDate: string,
  endDate: string,
  value: number
): number {
  const start = new Date(parseYMDDate(startDate));
  const end = new Date(parseYMDDate(endDate));

  //return the given value if we are showing a view for a month
  if (isStartAndEndOfSameMonth(start, end)) return value;

  // Calculate the difference in milliseconds and convert to days
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return Math.round((value / 30) * diffDays);
}

export const formatTimestampToYYYYMMDD = (isoString: string) =>
  new Date(isoString).toISOString().split("T")[0];
