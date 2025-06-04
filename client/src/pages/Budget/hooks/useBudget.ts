import { useEffect } from "react";
import useBudgetStore from "store/budget/budgetStore";

export default function useBudget() {
  const { isLoading, error, fetchBudget } = useBudgetStore();

  useEffect(() => {
    fetchBudget();
  }, []);
}
