// src/stores/transactionStore.ts
import axios from "axios";
import { create } from "zustand";
import {
  RawTransaction,
  Transaction,
} from "../../components/Transactions/types";

const API_BASE_URL = "http://localhost:8000/transactions"; // Replace with your API base URL

export interface TransactionStore {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  fetchTransactions: (queryString: string) => Promise<void>;
  addTransaction: (transaction: RawTransaction) => Promise<void>;
  updateTransaction: (
    id: string,
    updatedTransaction: Partial<Transaction>
  ) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,

  // Fetch all transactions
  fetchTransactions: async (queryString: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<Transaction[]>(
        API_BASE_URL + queryString
      );
      set({ transactions: response.data });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      set({ error: "Failed to fetch transactions" });
    } finally {
      set({ isLoading: false });
    }
  },

  // Add a new transaction
  addTransaction: async (transaction) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post<Transaction>(API_BASE_URL, transaction);
      set({ transactions: [response.data, ...get().transactions] });
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
      set({ transactions: filteredTransactions });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      set({ error: "Failed to delete transaction" });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useTransactionStore;
