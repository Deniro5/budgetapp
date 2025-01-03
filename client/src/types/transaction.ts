// src/types/Transaction.ts
export type Transaction = {
  _id: string;
  name: string;
  account: string;
  type: string;
  userId: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
  vendor: string;
  updatedAt: Date;
  createdAt: Date;
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
};
