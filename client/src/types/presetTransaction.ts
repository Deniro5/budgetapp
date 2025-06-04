// src/types/Transaction.ts

import { TransactionCategory, TransactionType } from "./Transaction";

export type PresetTransaction = {
  _id: string;
  name: string;
  account?: string;
  type?: TransactionType;
  userId: string;
  amount?: number;
  date?: string;
  category?: TransactionCategory;
  description?: string;
  vendor?: string;
  tags?: string[];
};
