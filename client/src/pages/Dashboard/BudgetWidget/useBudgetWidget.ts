import { useQueryClient } from "@tanstack/react-query";
import { TransactionCategory } from "types/Transaction";
import axios from "axios";
import { BASE_API_URL } from "../../../constants";
import useBudgetStore from "store/budget/budgetStore";
import { getAggregatedValue } from "../../../utils/DateUtils";
import { useQueryWithError } from "../../../hooks/useQueryWithError";

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

const fetchTransactionCategoriesByAmount = async (
  startDate: string,
  endDate: string
): Promise<BudgetCategoryData> => {
  const queryString = `startDate=${startDate}&endDate=${endDate}`;
  const response = await axios.get<BudgetCategoryData>(
    `${BASE_API_URL}/transactions/transaction-categories-by-amount?${queryString}`
  );
  return response.data;
};

export const useBudgetWidget = ({
  startDate,
  endDate,
}: useBudgetWidgetProps) => {
  const { budget } = useBudgetStore();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQueryWithError<
    BudgetCategoryData,
    Error
  >(
    ["budgetCategories", startDate, endDate],
    () => fetchTransactionCategoriesByAmount(startDate, endDate),
    {
      enabled: !!startDate && !!endDate,
    },
    "Failed to load budget categories"
  );

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
    return Object.values(budgetCategories).reduce(
      (acc, cur) => acc + getAggregatedValue(startDate, endDate, cur),
      0
    );
  };

  const getAvailableBudget = () => {
    const totalBudget = getAggregatedTotalBudget();
    if (!totalIncomeAndExpenseByDate) return totalBudget;

    const lastDate =
      totalIncomeAndExpenseByDate[totalIncomeAndExpenseByDate.length - 1];
    return totalBudget - (lastDate?.expense ?? 0);
  };

  return {
    categoriesWithBudget: getAggregatedCategoriesWithBudget(),
    totalBudget: getAggregatedTotalBudget(),
    availableBudget: getAvailableBudget(),
    isLoading,
    error,
  };
};
