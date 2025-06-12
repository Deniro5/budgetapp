import axios from "axios";
import { create } from "zustand";
import {
  RawTransaction,
  RawTransfer,
  Transaction,
  TransactionCategory,
} from "types/Transaction";
import { BASE_API_URL } from "../../constants";

const API_BASE_URL = "http://localhost:8000/transactions"; // Replace with your API base URL
export interface TransactionStore {
  transactions: Transaction[];
  transactionCount: number;
  isLoading: boolean;
  error: string | null;
  transactionCategoriesByAmount: {
    totalAmount: number;
    category: TransactionCategory;
  }[];

  fetchTransactions: (
    queryString: string,
    isInitialLoad: boolean
  ) => Promise<void>;
  addTransaction: (
    transaction: RawTransaction,
    callback?: (transaction: Transaction) => void
  ) => Promise<void>;
  updateTransaction: (
    id: string,
    updatedTransaction: Partial<Transaction>
  ) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addTransfer: (
    transaction: RawTransfer,
    callback?: (transfer: any) => void
  ) => Promise<void>;
}

const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  transactionCount: 0,
  offsetModifier: 0,
  isLoading: false,
  error: null,
  transactionCategoriesByAmount: [],

  // Fetch all transactions
  fetchTransactions: async (queryString: string, isInitialLoad: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<{
        transactions: Transaction[];
        transactionCount: number;
      }>(API_BASE_URL + queryString);
      const { transactions, transactionCount } = response.data;
      set({
        transactions: isInitialLoad
          ? transactions
          : [...get().transactions, ...transactions],
        transactionCount: transactionCount,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      set({ error: "Failed to fetch transactions" });
    } finally {
      set({ isLoading: false });
    }
  },

  // Add a new transaction
  addTransaction: async (transaction, callback) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post<Transaction>(API_BASE_URL, transaction);
      set({
        transactions: [response.data, ...get().transactions],
        transactionCount: get().transactionCount + 1,
      });
      if (callback) callback(response.data);
    } catch (error) {
      console.error("Error adding transaction:", error);
      set({ error: "Failed to add transaction" });
    } finally {
      set({ isLoading: false });
    }
  },

  // Update a transaction by ID
  updateTransaction: async (id, updatedTransaction) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put<Transaction>(
        `${API_BASE_URL}/${id}`,
        updatedTransaction
      );
      const updatedTransactions = get().transactions.map((transaction) =>
        transaction._id === id ? response.data : transaction
      );
      set({ transactions: updatedTransactions });
    } catch (error) {
      console.error("Error updating transaction:", error);
      set({ error: "Failed to update transaction" });
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete a transaction by ID
  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      const filteredTransactions = get().transactions.filter(
        (transaction) => transaction._id !== id
      );
      set({
        transactions: filteredTransactions,
        transactionCount: get().transactionCount - 1,
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      set({ error: "Failed to delete transaction" });
    } finally {
      set({ isLoading: false });
    }
  },
  // Add a new transaction
  addTransfer: async (transfer, callback) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post<{ transactions: Transaction[] }>(
        `${BASE_API_URL}/transfers`,
        transfer
      );
      set({
        transactions: [...response.data.transactions, ...get().transactions],
        transactionCount: get().transactionCount + 2,
      });
      if (callback) callback(response.data);
    } catch (error) {
      console.error("Error adding transfer:", error);
      set({ error: "Failed to add transfer" });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useTransactionStore;
