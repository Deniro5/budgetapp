import { useEffect, useState } from "react";
import useDashboardStore from "store/dashboard/dashboardStore";
import { TransactionCategory } from "types/Transaction";

type useDashboardProps = {
  startDate: string;
  endDate: string;
};

const useDashboard = ({ startDate, endDate }: useDashboardProps) => {
  const [categoryWidgetCategory, setCategoryWidgetCategory] = useState(
    TransactionCategory.Groceries
  );

  const [accountWidgetId, setAccountWidgetId] = useState("All");
  const {
    fetchTransactionCategoriesByAmount,
    fetchRecentTransactions,
    fetchTotalIncomeAndExpenseByDate,
    fetchCategoryExpenseByDate,
    fetchAccountWithBalances,
  } = useDashboardStore();

  //Other widgets

  useEffect(() => {
    const fetchData = async () => {
      const queryString = `startDate=${startDate}&endDate=${endDate}`;
      await fetchTransactionCategoriesByAmount(queryString);
      await fetchTotalIncomeAndExpenseByDate(queryString);
      await fetchRecentTransactions();
    };

    fetchData();
  }, [startDate, endDate]);

  //CategoryLineWidget only

  useEffect(() => {
    const fetchData = async () => {
      const queryString = `startDate=${startDate}&endDate=${endDate}&category=${categoryWidgetCategory}`;
      await fetchCategoryExpenseByDate(queryString);
    };

    fetchData();
  }, [startDate, endDate, categoryWidgetCategory]);

  //AccountWidget only

  useEffect(() => {
    console.log("eyafiaehfeiu");
    const fetchData = async () => {
      const queryString = `startDate=${startDate}&endDate=${endDate}`;
      await fetchAccountWithBalances(accountWidgetId, queryString);
    };

    fetchData();
  }, [startDate, endDate, accountWidgetId]);

  return {
    categoryWidgetCategory,
    setCategoryWidgetCategory,
    accountWidgetId,
    setAccountWidgetId,
  };
};

export default useDashboard;
