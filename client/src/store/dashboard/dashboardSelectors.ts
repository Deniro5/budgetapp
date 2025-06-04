import { transactionsCategories } from "src/dataUtilities";
import useDashboardStore from "./dashboardStore";
import { DashboardStore } from "./dashboardStore";
import useBudgetStore from "store/budget/budgetStore";
import { getAggregatedValue } from "../../utils/DateUtils";

export const getTotalIncome = () =>
  useDashboardStore((state: DashboardStore) => {
    if (!state.totalIncomeAndExpenseByDate.length) return 0;

    const lastDate =
      state.totalIncomeAndExpenseByDate[
        state.totalIncomeAndExpenseByDate.length - 1
      ];
    return lastDate.income;
  });

export const getTotalExpense = () =>
  useDashboardStore((state: DashboardStore) => {
    if (!state.totalIncomeAndExpenseByDate.length) return 0;

    const lastDate =
      state.totalIncomeAndExpenseByDate[
        state.totalIncomeAndExpenseByDate.length - 1
      ];
    return lastDate.expense;
  });

export const getNetIncome = () => getTotalIncome() - getTotalExpense();

export const getAggregatedCategoriesWithBudget = (
  startDate: string,
  endDate: string
) => {
  const transactionCategoriesByAmount = useDashboardStore(
    (state) => state.transactionCategoriesByAmount
  );
  const budgets = useBudgetStore((state) => state.budget);

  if (!budgets.budgetCategories || !transactionCategoriesByAmount)
    return transactionCategoriesByAmount;

  // Merge budget info
  return transactionCategoriesByAmount.map((transactionCategoryByAmount) => {
    const rawTotalAmount = transactionCategoryByAmount.totalAmount;
    const rawBudget = getAggregatedValue(
      startDate,
      endDate,
      budgets.budgetCategories[transactionCategoryByAmount.category] || 0
    );

    return {
      ...transactionCategoryByAmount,
      totalAmount: Math.sqrt(rawTotalAmount),
      budget: Math.sqrt(rawBudget),
      rawTotalAmount: "$" + rawTotalAmount,
      rawBudget: "$" + rawBudget,
    };
  });
};
