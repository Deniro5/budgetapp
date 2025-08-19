import { BASE_API_URL } from "appConstants";
import axios from "axios";
import { useQueryWithError } from "hooks/useQueryWithError";

type useIncomeExpenseWidgetProps = {
  startDate: string;
  endDate: string;
};

type IncomeExpenseData = {
  date: string;
  income: number;
  expense: number;
}[];

const fetchIncomeAndExpense = async (
  startDate: string,
  endDate: string
): Promise<IncomeExpenseData> => {
  const queryString = `startDate=${startDate}&endDate=${endDate}`;
  const response = await axios.get<IncomeExpenseData>(
    `${BASE_API_URL}/transactions/total-income-and-expense-by-date?${queryString}`
  );
  return response.data;
};

export const useIncomeExpenseWidget = ({
  startDate,
  endDate,
}: useIncomeExpenseWidgetProps) => {
  const { data, isLoading, error } = useQueryWithError<
    IncomeExpenseData,
    Error
  >(
    ["incomeExpense", startDate, endDate],
    () => fetchIncomeAndExpense(startDate, endDate),
    {
      enabled: !!startDate && !!endDate,
    },
    "Failed to load income and expense data"
  );

  const getNetIncome = () => {
    if (!data?.length) return 0;
    const lastDate = data[data.length - 1];
    return lastDate.income - lastDate.expense;
  };

  return {
    totalIncomeAndExpenseByDate: data ?? [],
    netIncome: getNetIncome(),
    isLoading,
    error,
  };
};
