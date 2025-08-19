import { useQueryWithError } from "hooks/useQueryWithError";
import axios from "axios";
import { BASE_API_URL } from "appConstants";
import { BudgetType } from "types/budget";
export const useBudget = () => {
  const {
    data: budget,
    isLoading,
    error,
  } = useQueryWithError<BudgetType, Error>(
    ["budget"],
    async () => {
      const res = await axios.get<BudgetType>(`${BASE_API_URL}/budget`);
      return res.data;
    },
    { enabled: true },
    "Failed to fetch budget"
  );

  const getTotalBudget = () => {
    if (!budget || !budget.budgetCategories) return 0;
    const budgetValues = Object.values(budget.budgetCategories);
    return budgetValues.reduce((acc, cur) => acc + cur, 0);
  };

  return {
    budget,
    isLoading,
    error,
    getTotalBudget,
  };
};
