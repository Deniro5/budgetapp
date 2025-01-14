// src/types/Transaction.ts

export enum TransactionType {
  EXPENSE = "Expense",
  INCOME = "Income",
}
export type Transaction = {
  _id: string;
  name: string;
  account: string;
  type: TransactionType;
  userId: string;
  amount: number;
  date: string;
  category: string;
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
  tag?: string;
  category?: string;
};
