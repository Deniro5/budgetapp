import { useQueryWithError } from "hooks/useQueryWithError";
import axios from "axios";
import { BASE_API_URL } from "appConstants";
import { Transaction } from "types/Transaction";
import { useEffect } from "react";
import useTransactionStore from "store/transaction/transactionStore";

const fetchRecentTransactions = async (): Promise<Transaction[]> => {
  const response = await axios.get<{ transactions: Transaction[] }>(
    `${BASE_API_URL}/transactions?limit=5`
  );
  return response.data.transactions;
};

export const useRecentTransactionsWidget = () => {
  const { setView } = useTransactionStore();

  useEffect(() => {
    setView("Transactions");
  }, []);

  const { data, isLoading, error, refetch } = useQueryWithError<
    Transaction[],
    Error
  >(
    ["recentTransactions"],
    fetchRecentTransactions,
    { enabled: true },
    "Failed to load recent transactions"
  );

  return {
    recentTransactions: data ?? [],
    isLoading,
    error,
    refetch,
  };
};
