import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_API_URL } from "../../../constants";
import { Transaction } from "types/Transaction";

const fetchRecentTransactions = async (): Promise<Transaction[]> => {
  const response = await axios.get<{ transactions: Transaction[] }>(
    `${BASE_API_URL}/transactions?limit=5`
  );

  return response.data.transactions;
};

export const useRecentTransactionsWidget = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["recentTransactions"],
    queryFn: () => fetchRecentTransactions(),
    enabled: true,
  });

  return {
    recentTransactions: data ?? [],
    isLoading,
    error,
    refetch,
  };
};
