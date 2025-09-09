// src/types/Transaction.ts

export enum TransactionType {
  EXPENSE = "Expense",
  INCOME = "Income",
}

//typescript doesnt support union of enums so keep two separate
export enum TransactionCategory {
  Car = "Car",
  Charity = "Charity",
  Childcare = "Childcare",
  Education = "Education",
  Entertainment = "Entertainment",
  Food = "Food",
  Gas = "Gas",
  Gifts = "Gifts",
  Groceries = "Groceries",
  HealthAndFitness = "Health And Fitness",
  Hobbies = "Hobbies",
  HomeImprovement = "Home Improvement",
  Housing = "Housing",
  Insurance = "Insurance",
  Internet = "Internet",
  PersonalCare = "Personal Care",
  Pets = "Pets",
  Phone = "Phone",
  Salary = "Salary",
  Subscriptions = "Subscriptions",
  Transit = "Transit",
  Travel = "Travel",
  Utilities = "Utilities",
  WorkExpenses = "Work Expenses",
  Other = "Other",

  // Not a budget
  Transfer = "Transfer",
}

export const budgetOnlyCategories = Object.values(TransactionCategory).filter(
  (cat) =>
    cat !== TransactionCategory.Transfer && cat !== TransactionCategory.Salary
);

export const transactionOnlyCategories = Object.values(
  TransactionCategory
).filter((cat) => cat !== TransactionCategory.Transfer);

export type Transaction = {
  _id: string;
  account: {
    _id: string;
    name: string;
  };
  type: TransactionType;
  userId: string;
  amount: number;
  date: string;
  category: TransactionCategory;
  description?: string;
  vendor: string;
  updatedAt: Date;
  createdAt: Date;
  tags: string[];
};

export type RawTransaction = Omit<
  Transaction,
  "_id" | "userId" | "createdAt" | "updatedAt" | "account"
> & {
  account: string;
};

export type TransactionFilter = {
  search?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  type?: string;
  account?: string;
  tags?: string[];
  category?: TransactionCategory;
};

export type RawTransfer = {
  sendingAccountId: string;
  receivingAccountId: string;
  date: string;
  amount: number;
};

export type PresetTransaction = {
  _id: string;
  name: string;
  account?: {
    _id: string;
    name: string;
  };
  type?: TransactionType;
  userId: string;
  amount?: number;
  date?: string;
  category?: TransactionCategory;
  description?: string;
  vendor?: string;
  tags?: string[];
  updatedAt: Date;
  createdAt: Date;
};

export type RawPresetTransaction = Omit<
  PresetTransaction,
  "_id" | "userId" | "account"
> & {
  account?: string;
};

export enum RecurringTransactionInterval {
  DAILY = "daily",
  WEEKLY = "weekly",
  BI_WEEKLY = "bi-weekly",
  MONTHLY = "monthly",
}
export type RecurringTransaction = {
  _id: string;
  name: string;
  account: {
    _id: string;
    name: string;
  };
  type: TransactionType;
  userId: string;
  amount: number;
  date: string;
  category: TransactionCategory;
  description?: string;
  vendor?: string;
  tags?: string[];
  updatedAt: Date;
  createdAt: Date;
  nextRunDate: string;
  interval: RecurringTransactionInterval;
};

export type RawRecurringTransaction = Omit<
  RecurringTransaction,
  "_id" | "userId" | "account"
> & {
  account?: string;
};

export type OnSubmit = {
  (transaction: RawTransaction): void;
  (transaction: Partial<RawPresetTransaction>): void;
};
