// src/types/Transaction.ts

export enum TransactionType {
  EXPENSE = "Expense",
  INCOME = "Income",
}

export enum TransactionCategory {
  Car = "car",
  Charity = "charity",
  Childcare = "childcare",
  Education = "education",
  Entertainment = "entertainment",
  Food = "food",
  Gas = "gas",
  Gifts = "gifts",
  Groceries = "groceries",
  HealthAndFitness = "healthandfitness",
  Hobbies = "hobbies",
  HomeImprovement = "homeimprovement",
  Housing = "housing",
  Insurance = "insurance",
  Internet = "internet",
  PersonalCare = "personalcare",
  Pets = "pets",
  Phone = "phone",
  Salary = "salary",
  Subscriptions = "subscriptions",
  Transit = "transit",
  Travel = "travel",
  Utilities = "utilities",
  WorkExpenses = "workexpenses",
  Other = "other",
  Transfer = "transfer",
}

export const TransactionCategoryNameMap: Record<TransactionCategory, string> = {
  [TransactionCategory.Car]: "Car",
  [TransactionCategory.Charity]: "Charity",
  [TransactionCategory.Childcare]: "Childcare",
  [TransactionCategory.Education]: "Education",
  [TransactionCategory.Entertainment]: "Entertainment",
  [TransactionCategory.Food]: "Food",
  [TransactionCategory.Gas]: "Gas",
  [TransactionCategory.Gifts]: "Gifts",
  [TransactionCategory.Groceries]: "Groceries",
  [TransactionCategory.HealthAndFitness]: "Health & Fitness",
  [TransactionCategory.Hobbies]: "Hobbies",
  [TransactionCategory.HomeImprovement]: "Home Improvement",
  [TransactionCategory.Housing]: "Housing",
  [TransactionCategory.Insurance]: "Insurance",
  [TransactionCategory.Internet]: "Internet",
  [TransactionCategory.PersonalCare]: "Personal Care",
  [TransactionCategory.Pets]: "Pets",
  [TransactionCategory.Phone]: "Phone",
  [TransactionCategory.Salary]: "Salary",
  [TransactionCategory.Subscriptions]: "Subscriptions",
  [TransactionCategory.Transit]: "Transit",
  [TransactionCategory.Travel]: "Travel",
  [TransactionCategory.Utilities]: "Utilities",
  [TransactionCategory.WorkExpenses]: "Work Expenses",
  [TransactionCategory.Other]: "Other",
  [TransactionCategory.Transfer]: "Transfer",
};

export type Transaction = {
  _id: string;
  name: string;
  account: string;
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

// src/types/Transaction.ts
export type RawTransaction = Omit<
  Transaction,
  "_id" | "userId" | "createdAt" | "updatedAt"
>;

export type TransactionFilter = {
  search?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  type?: string;
  account?: string;
  tags?: string[];
  categories?: string[];
};

export type RawTransfer = {
  sendingAccountId: string;
  receivingAccountId: string;
  date: string;
  amount: number;
};
