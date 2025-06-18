import axios from "axios";
import { create } from "zustand";
import { BudgetType } from "types/budget"; // Replace with the correct path for your `Budget` type

const API_BASE_URL = "http://localhost:8000/budget"; // Replace with your actual API URL

export interface BudgetStore {
  budget: BudgetType;

  isLoading: boolean;
  error: string | null;

  fetchBudget: () => Promise<void>;
  updateBudget: (updatedBudget: Partial<BudgetType>) => Promise<void>;
}

const useBudgetStore = create<BudgetStore>((set, get) => ({
  budget: {} as BudgetType,
  budgetId: null,
  isLoading: false,
  error: null,

  // Fetch budget
  fetchBudget: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<BudgetType>(API_BASE_URL);
      set({ budget: response.data });
    } catch (error) {
      console.error("Error fetching budget:", error);
      set({ error: "Failed to fetch budget" });
    } finally {
      set({ isLoading: false });
    }
  },
  // Update the entire budget
  updateBudget: async (updatedBudget) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put<BudgetType>(API_BASE_URL, updatedBudget);
      set({ budget: response.data });
    } catch (error) {
      console.error("Error updating budget:", error);
      set({ error: "Failed to update budget" });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useBudgetStore;
