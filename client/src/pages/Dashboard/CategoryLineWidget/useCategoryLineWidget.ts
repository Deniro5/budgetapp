import { useState } from "react";
import { BASE_API_URL } from "../../../constants";
import { TransactionCategory } from "types/Transaction";
import axios from "axios";
import { useQueryWithError } from "../../../hooks/useQueryWithError";
import { useBudget } from "../../../pages/Budget/hooks/useBudget";
import { getAggregatedValue } from "../../../utils/DateUtils";

type useCategoryLineWidgetProps = {
  startDate: string;
  endDate: string;
};

type CategoryExpenseByDate = {
  date: string;
  expense: number;
}[];

const fetchCategoryExpenseByDate = async (
  startDate: string,
  endDate: string,
  category: TransactionCategory
): Promise<CategoryExpenseByDate> => {
  const queryString = `startDate=${startDate}&endDate=${endDate}&category=${category}`;
  const response = await axios.get<CategoryExpenseByDate>(
    `${BASE_API_URL}/transactions/total-income-and-expense-by-date?${queryString}`
  );

  return response.data;
};

export const useCategoryLineWidget = ({
  startDate,
  endDate,
}: useCategoryLineWidgetProps) => {
  const [category, setCategory] = useState(TransactionCategory.Groceries);

  const { data, isLoading, error } = useQueryWithError<
    CategoryExpenseByDate,
    Error
  >(
    ["categoryExpenseByDate", startDate, endDate, category],
    () => fetchCategoryExpenseByDate(startDate, endDate, category),
    {
      enabled: !!startDate && !!endDate && !!category,
    },
    "Failed to load category expense data"
  );

  const { budget } = useBudget();

  const getAggregatedCategoryBudgetLine = () => {
    if (!budget || !budget.budgetCategories) return 0;

    const budgetLineValue = Math.round(
      getAggregatedValue(
        startDate,
        endDate,
        budget.budgetCategories[category] || 0
      )
    );

    return budgetLineValue;
  };

  return {
    categoryExpenseByDate: data ?? [],
    category,
    setCategory,
    isLoading,
    error,
    getAggregatedCategoryBudgetLine,
  };
};
