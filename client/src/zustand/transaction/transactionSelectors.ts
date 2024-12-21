import { Transaction } from "../../types/transaction";
import useTransactionStore from "./transactionStore";
import { TransactionStore } from "./transactionStore";

export const selectTransactions = () =>
  useTransactionStore((state: TransactionStore) => state.transactions);

export const getSelectedTransactionById = (id: string | null) =>
  useTransactionStore((state: TransactionStore) => {
    if (!id) return;
    return state.transactions.find((transaction) => transaction._id === id);
  });
