import validator from "validator";

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

//Auth

export function sanitizeUsername(username: string) {
  return validator.escape(username.trim());
}

export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  return usernameRegex.test(username);
}

//string formatting

export function getDollarValue(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatCamelCaseToTitleCase(input: string) {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space before uppercase letters
    .replace(/^./, (char) => char.toUpperCase()); // Capitalize the first letter
}
