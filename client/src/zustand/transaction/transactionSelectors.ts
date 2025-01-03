import useTransactionStore from "./transactionStore";
import { TransactionStore } from "./transactionStore";

export const selectTransactions = () =>
  useTransactionStore((state: TransactionStore) => state.transactions);

export const getTransactionById = (id: string | null) =>
  useTransactionStore((state: TransactionStore) => {
    if (!id) return;
    return state.transactions.find((transaction) => transaction._id === id);
  });
