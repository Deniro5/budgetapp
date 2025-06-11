import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BASE_API_URL } from "../../../constants";
import { TransactionCategory } from "types/Transaction";
import axios from "axios";

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
  const response = await axios.get(
    `${BASE_API_URL}/transactions/total-income-and-expense-by-date?${queryString}`
  );

  return response.data;
};

export const useCategoryLineWidget = ({
  startDate,
  endDate,
}: useCategoryLineWidgetProps) => {
  const [category, setCategory] = useState(TransactionCategory.Groceries);

  const { data, isLoading, error } = useQuery({
    queryKey: ["categoryExpenseByDate", startDate, endDate, category],
    queryFn: () => fetchCategoryExpenseByDate(startDate, endDate, category),
    enabled: !!startDate && !!endDate && !!category,
  });

  return {
    categoryExpenseByDate: data ?? [],
    category,
    setCategory,
    isLoading,
    error,
  };
};
