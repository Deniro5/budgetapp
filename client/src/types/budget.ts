import { TransactionCategory } from "./Transaction";

export type BudgetCategories = Record<TransactionCategory, number>;

export type BudgetType = {
  budgetCategories: BudgetCategories;
};
