import axios from "axios";
import { create } from "zustand";
import { Account } from "types/account";

const API_BASE_URL = "http://localhost:8000/accounts"; // Replace with your actual API URL

const getAccountIdToNameMap = (accounts: Account[]) =>
  accounts.reduce((acc: Record<string, string>, cur) => {
    acc[cur._id] = cur.name;
    return acc;
  }, {});

export interface AccountStore {
  accounts: Account[];
  accountIdToNameMap: Record<string, string>;
  isLoading: boolean;
  error: string | null;

  fetchAccounts: () => Promise<void>;
  addAccount: (account: Omit<Account, "_id">) => Promise<void>;
  updateAccount: (
    id: string,
    updatedAccount: Partial<Account>
  ) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
}

const useAccountStore = create<AccountStore>((set, get) => ({
  accounts: [],
  accountIdToNameMap: {},
  isLoading: false,
  error: null,

  // Fetch all accounts
  fetchAccounts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<Account[]>(API_BASE_URL);
      const accounts = response.data;
      set({
        accounts,
        accountIdToNameMap: getAccountIdToNameMap(accounts),
      });
    } catch (error) {
      console.error("Error fetching accounts:", error);
      set({ error: "Failed to fetch accounts" });
    } finally {
      set({ isLoading: false });
    }
  },

  // Add a new account
  addAccount: async (account) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post<Account>(API_BASE_URL, account);
      const accounts = [response.data, ...get().accounts];
      set({
        accounts,
        accountIdToNameMap: getAccountIdToNameMap(accounts),
      });
    } catch (error) {
      console.error("Error adding account:", error);
      set({ error: "Failed to add account" });
    } finally {
      set({ isLoading: false });
    }
  },

  // Update an account by ID
  updateAccount: async (id, updatedAccount) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put<Account>(
        `${API_BASE_URL}/${id}`,
        updatedAccount
      );
      const updatedAccounts = get().accounts.map((account) =>
        account._id === id ? response.data : account
      );
      set({
        accounts: updatedAccounts,
        accountIdToNameMap: getAccountIdToNameMap(updatedAccounts),
      });
    } catch (error) {
      console.error("Error updating account:", error);
      set({ error: "Failed to update account" });
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete an account by ID
  deleteAccount: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      const accounts = get().accounts.filter((account) => account._id !== id);
      set({
        accounts,
        accountIdToNameMap: getAccountIdToNameMap(accounts),
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      set({ error: "Failed to delete account" });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAccountStore;
