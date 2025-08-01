import { TransactionCategory } from "types/Transaction";
import useBudgetStore from "./budgetStore";
import { BudgetStore } from "./budgetStore";
import { getAggregatedValue } from "../../utils/DateUtils";

export const getTotalBudget = () =>
  useBudgetStore((state: BudgetStore) => {
    if (!state.budget.budgetCategories) return 0;

    const budgetValues = Object.values(state.budget.budgetCategories);
    return budgetValues.reduce((acc, cur) => acc + cur, 0);
  });
