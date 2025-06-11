import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TransactionCategory } from "types/Transaction";
import axios from "axios";
import { BASE_API_URL } from "../../../constants";
import useBudgetStore from "store/budget/budgetStore";
import { getAggregatedValue } from "../../../utils/DateUtils";

type useBudgetWidgetProps = {
  startDate: string;
  endDate: string;
};

type BudgetCategoryData = {
  categoryTotals: {
    totalAmount: number;
    category: TransactionCategory;
  }[];
};

type IncomeExpenseData = {
  date: string;
  income: number;
  expense: number;
}[];

// Placeholder async fetch function
const fetchTransactionCategoriesByAmount = async (
  startDate: string,
  endDate: string
): Promise<BudgetCategoryData> => {
  const queryString = `startDate=${startDate}&endDate=${endDate}`;
  const response = await axios.get(
    `${BASE_API_URL}/transactions/transaction-categories-by-amount?${queryString}`
  );

  return response.data;
};

export const useBudgetWidget = ({
  startDate,
  endDate,
}: useBudgetWidgetProps) => {
  const { budget } = useBudgetStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ["budgetCategories", startDate, endDate],
    queryFn: () => fetchTransactionCategoriesByAmount(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });

  const queryClient = useQueryClient();

  const totalIncomeAndExpenseByDate =
    queryClient.getQueryData<IncomeExpenseData>([
      "incomeExpense",
      startDate,
      endDate,
    ]);

  const budgetCategories = budget?.budgetCategories;
  const categoryTotals = data?.categoryTotals;

  const getAggregatedCategoriesWithBudget = () => {
    if (!budgetCategories || !categoryTotals) return categoryTotals;

    // Merge budget info
    return categoryTotals.map((categoryTotal) => {
      const rawTotalAmount = categoryTotal.totalAmount;
      const rawBudget = getAggregatedValue(
        startDate,
        endDate,
        budgetCategories[categoryTotal.category] || 0
      );

      return {
        ...categoryTotal,
        totalAmount: Math.sqrt(rawTotalAmount),
        budget: Math.sqrt(rawBudget),
        rawTotalAmount: "$" + rawTotalAmount,
        rawBudget: "$" + rawBudget,
      };
    });
  };

  const getAggregatedTotalBudget = () => {
    if (!budgetCategories) return 0;

    const budgetValues = Object.values(budgetCategories);
    return budgetValues.reduce(
      (acc, cur) => acc + getAggregatedValue(startDate, endDate, cur),
      0
    );
  };

  const getAvailableBudget = () => {
    const totalBudget = getAggregatedTotalBudget();
    if (!totalIncomeAndExpenseByDate) return totalBudget;

    const lastDate =
      totalIncomeAndExpenseByDate[totalIncomeAndExpenseByDate.length - 1];
    return totalBudget - lastDate.expense;
  };

  const categoriesWithBudget = getAggregatedCategoriesWithBudget();
  const totalBudget = getAggregatedTotalBudget();
  const availableBudget = getAvailableBudget();

  return {
    categoriesWithBudget,
    totalBudget,
    availableBudget,
    isLoading,
    error,
  };
};
