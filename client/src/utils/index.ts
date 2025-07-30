import validator from "validator";

//Routing

export function getFirstPath() {
  const currentPath = window.location.pathname;
  // Extract the first part of the path after the '/'
  const firstPath = currentPath.split("/")[1];
  return firstPath;
}

//Date

//Auth

export function sanitizeUsername(username: string) {
  return validator.escape(username.trim());
}

export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  return usernameRegex.test(username);
}

//string formatting

export function formatCamelCaseToTitleCase(input: string) {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space before uppercase letters
    .replace(/^./, (char) => char.toUpperCase()); // Capitalize the first letter
}

//string validation

export function isAlphanumeric(key: string) {
  return /^[a-zA-Z0-9]$/.test(key);
}

//number formatting

export function roundTo2Decimals(num: number) {
  return Math.round(num * 100) / 100;
}

export function formatToCurrency(value: number | string): string {
  return Number(value).toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
  });
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatCurrencyShort(value: number): string {
  const format = (num: number) =>
    num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);

  if (value >= 1_000_000) return `$${format(value / 1_000_000)}M`;
  if (value >= 1_000) return `$${format(value / 1_000)}K`;
  return `$${format(value)}`;
}
