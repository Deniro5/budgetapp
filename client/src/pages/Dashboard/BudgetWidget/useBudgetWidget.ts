import { useQueryClient } from "@tanstack/react-query";
import { TransactionCategory } from "types/Transaction";
import axios from "axios";
import { BASE_API_URL } from "appConstants";
import { getAggregatedValue } from "utils/DateUtils";
import { useQueryWithError } from "hooks/useQueryWithError";
import { useBudget } from "pages/Budget/hooks/useBudget";
import { BudgetCategories } from "types/budget";

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

type CategoryWithAggregatedBudget = {
  category: TransactionCategory;
  totalAmount: number;
  budget: number;
  rawTotalAmount: number;
  rawBudget: number;
  isOverBudget: boolean;
};

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
  const { budget } = useBudget();
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
    if (!budgetCategories || !categoryTotals) return [];

    const categoryTotalsKeyedByCategory: Record<string, number> =
      categoryTotals.reduce((acc: Record<string, number>, cur) => {
        acc[cur.category] = cur.totalAmount;
        return acc;
      }, {});

    const budgetKeys = Object.keys(
      budgetCategories
    ) as (keyof BudgetCategories)[];

    const categoriesWithAggregatedBudget = budgetKeys.reduce(
      (acc: CategoryWithAggregatedBudget[], category) => {
        const budgetLimit = budgetCategories[category] || 0;
        const rawTotalAmount = categoryTotalsKeyedByCategory[category] || 0;

        if (!budgetLimit && !rawTotalAmount) return acc;
        const rawBudget = getAggregatedValue(startDate, endDate, budgetLimit);

        acc.push({
          category,
          rawBudget,
          totalAmount: Math.sqrt(rawTotalAmount),
          budget: Math.sqrt(rawBudget),
          rawTotalAmount,
          isOverBudget: rawTotalAmount > rawBudget,
        });
        return acc;
      },
      []
    );
    categoriesWithAggregatedBudget.sort(
      (a, b) => b.rawTotalAmount - a.rawTotalAmount
    );
    return categoriesWithAggregatedBudget;
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
