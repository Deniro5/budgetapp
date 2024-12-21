import { useEffect } from "react";
import useTransactionStore from "../zustand/transaction/transactionStore";

export default function useTransaction() {
  const { isLoading, error, fetchTransactions, transactions } =
    useTransactionStore();

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    isLoading,
    error,
  };
}
