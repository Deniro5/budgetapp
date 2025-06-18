import { TransactionCategory } from "./Transaction";

type BasePreferences<T = string | null> = {
  currency: string; // Consider replacing string with a Currency type
  disabledCategories: TransactionCategory[];
  defaultAccount: T;
};

export type RawUserPreferences = BasePreferences<string | null>;
export type UserPreferences = BasePreferences<{
  _id: string;
  name: string;
} | null>;

export type RawUser = {
  _id: string;
  username: string;
  password: string;
  preferences: RawUserPreferences;
};

export type User = {
  _id: string;
  username: string;
  password: string;
  preferences: UserPreferences;
};
