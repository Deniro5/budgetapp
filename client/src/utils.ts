//Routing

export function getFirstPath() {
  const currentPath = window.location.pathname;
  // Extract the first part of the path after the '/'
  const firstPath = currentPath.split("/")[1];
  return firstPath;
}

//Date

export function dateToFormattedString(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US").format(date); // mm/dd/yyyy format
}

export function parseDate(value: string): Date | null {
  const [month, day, year] = value.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  return !isNaN(date.getTime()) ? date : null;
}
