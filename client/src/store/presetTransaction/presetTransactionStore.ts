import axios from "axios";
import { create } from "zustand";
import { PresetTransaction, RawPresetTransaction } from "types/Transaction";

const API_BASE_URL = "http://localhost:8000/preset-transactions"; // Replace with your API base URL

export interface PresetTransactionStore {
  presetTransactions: PresetTransaction[];
  presetTransactionCount: number;
  isLoading: boolean;
  error: string | null;
  hasLoaded: boolean;

  fetchPresetTransactions: () => Promise<void>;
  addPresetTransaction: (transaction: RawPresetTransaction) => Promise<void>;
  updatePresetTransaction: (
    id: string,
    updatedTransaction: Partial<PresetTransaction>
  ) => Promise<void>;
  deletePresetTransaction: (id: string) => Promise<void>;
}

const usePresetTransactionStore = create<PresetTransactionStore>(
  (set, get) => ({
    presetTransactions: [],
    presetTransactionCount: 0,
    isLoading: false,
    error: null,
    hasLoaded: false,

    // Fetch all transactions
    fetchPresetTransactions: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get<PresetTransaction[]>(API_BASE_URL);
        set({ presetTransactions: response.data });
      } catch (error) {
        console.error("Error fetching transactions:", error);
        set({ error: "Failed to fetch transactions" });
      } finally {
        set({ isLoading: false, hasLoaded: true });
      }
    },

    // Add a new transaction
    addPresetTransaction: async (transaction) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post<PresetTransaction>(
          API_BASE_URL,
          transaction
        );
        set({
          presetTransactions: [response.data, ...get().presetTransactions],
        });
      } catch (error) {
        console.error("Error adding transaction:", error);
        set({ error: "Failed to add transaction" });
      } finally {
        set({ isLoading: false });
      }
    },

    // Update a transaction by ID
    updatePresetTransaction: async (id, updatedTransaction) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.put<PresetTransaction>(
          `${API_BASE_URL}/${id}`,
          updatedTransaction
        );
        const updatedTransactions = get().presetTransactions.map(
          (transaction) =>
            transaction._id === id ? response.data : transaction
        );
        set({ presetTransactions: updatedTransactions });
      } catch (error) {
        console.error("Error updating transaction:", error);
        set({ error: "Failed to update transaction" });
      } finally {
        set({ isLoading: false });
      }
    },

    // Delete a transaction by ID
    deletePresetTransaction: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        const filteredTransactions = get().presetTransactions.filter(
          (transaction) => transaction._id !== id
        );
        set({ presetTransactions: filteredTransactions });
      } catch (error) {
        console.error("Error deleting transaction:", error);
        set({ error: "Failed to delete transaction" });
      } finally {
        set({ isLoading: false });
      }
    },
  })
);

export default usePresetTransactionStore;
