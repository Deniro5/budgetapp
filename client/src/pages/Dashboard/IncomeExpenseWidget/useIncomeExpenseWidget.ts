import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_API_URL } from "../../../constants";

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
  // Replace this with actual fetch logic
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
  const { data, isLoading, error } = useQuery({
    queryKey: ["incomeExpense", startDate, endDate],
    queryFn: () => fetchIncomeAndExpense(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });

  const getNetIncome = () => {
    if (!data || !data.length) return 0;

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
