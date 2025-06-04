import { Transaction, TransactionCategory } from "types/Transaction";
import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Replace with your API base URL

export interface DashboardStore {
  recentTransactions: Transaction[];
  recentTransactionsLoading: boolean;
  recentTransactionsError: string | null;

  transactionCategoriesByAmount: {
    totalAmount: number;
    category: TransactionCategory;
  }[];
  transactionCategoriesByAmountLoading: boolean;
  transactionCategoriesByAmountError: string | null;

  totalIncomeAndExpenseByDate: {
    date: string;
    income: number;
    expense: number;
  }[];

  totalIncomeAndExpenseByDateLoading: boolean;
  totalIncomeAndExpenseByDateError: string | null;

  categoryExpenseByDate: {
    date: string;
    expense: number;
  }[];

  categoryExpenseByDateLoading: boolean;
  categoryExpenseByDateError: string | null;

  accountWithBalances: {
    date: string;
    balance: number;
  }[];
  accountWithBalancesLoading: boolean;
  accountWithBalancesError: string | null;

  fetchRecentTransactions: () => Promise<void>;
  fetchTransactionCategoriesByAmount: (queryString: string) => Promise<void>;
  fetchTotalIncomeAndExpenseByDate: (queryString: string) => Promise<void>;
  fetchCategoryExpenseByDate: (queryString: string) => Promise<void>;
  fetchAccountWithBalances: (id: string, queryString: string) => Promise<void>;
  addRecentTransaction: (transaction: Transaction) => void;
}

const useDashboardStore = create<DashboardStore>((set, get) => ({
  recentTransactions: [],
  recentTransactionsLoading: false,
  recentTransactionsError: null,

  transactionCategoriesByAmount: [],
  transactionCategoriesByAmountLoading: false,
  transactionCategoriesByAmountError: null,

  totalIncomeAndExpenseByDate: [],
  totalIncomeAndExpenseByDateLoading: false,
  totalIncomeAndExpenseByDateError: null,

  categoryExpenseByDate: [],
  categoryExpenseByDateLoading: false,
  categoryExpenseByDateError: null,

  accountWithBalances: [],
  accountWithBalancesLoading: false,
  accountWithBalancesError: null,

  fetchRecentTransactions: async () => {
    set({ recentTransactionsLoading: true, recentTransactionsError: null });
    try {
      const response = await axios.get<{ transactions: Transaction[] }>(
        API_BASE_URL + `/transactions?limit=5`
      );
      set({
        recentTransactions: response.data.transactions,
        recentTransactionsLoading: false,
      });
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
      set({
        recentTransactionsError:
          "Unable to fetch recent transactions. Please try again",
        recentTransactionsLoading: false,
      });
    }
  },

  fetchTransactionCategoriesByAmount: async (queryString: string) => {
    set({
      transactionCategoriesByAmountLoading: true,
      transactionCategoriesByAmountError: null,
    });
    try {
      const response = await axios.get<{
        categoryTotals: {
          totalAmount: number;
          category: TransactionCategory;
        }[];
      }>(
        `${API_BASE_URL}/transactions/transaction-categories-by-amount?${queryString}`
      );
      set({
        transactionCategoriesByAmount: response.data.categoryTotals,
        transactionCategoriesByAmountLoading: false,
      });
    } catch (error) {
      console.error("Error fetching transaction categories by amount:", error);
      set({
        transactionCategoriesByAmountError:
          "Unable to fetch top categories. Please try again",
        transactionCategoriesByAmountLoading: false,
      });
    }
  },

  fetchTotalIncomeAndExpenseByDate: async (queryString: string) => {
    set({
      totalIncomeAndExpenseByDateLoading: false,
      totalIncomeAndExpenseByDateError: null,
    });
    try {
      const response = await axios.get<
        {
          date: string;
          income: number;
          expense: number;
        }[]
      >(
        `${API_BASE_URL}/transactions/total-income-and-expense-by-date?${queryString}`
      );
      set({
        totalIncomeAndExpenseByDate: response.data,
        totalIncomeAndExpenseByDateLoading: false,
      });
    } catch (error) {
      console.error("Error fetching transaction categories by amount:", error);
      set({
        transactionCategoriesByAmountError:
          "Unable to fetch top categories. Please try again",
        transactionCategoriesByAmountLoading: false,
      });
    }
  },
  fetchCategoryExpenseByDate: async (queryString: string) => {
    set({
      categoryExpenseByDateLoading: false,
      categoryExpenseByDateError: null,
    });
    try {
      const response = await axios.get<
        {
          date: string;
          expense: number;
        }[]
      >(
        `${API_BASE_URL}/transactions/total-income-and-expense-by-date?${queryString}`
      );
      set({
        categoryExpenseByDate: response.data,
        categoryExpenseByDateLoading: false,
      });
    } catch (error) {
      console.error("Error fetching category expense by data:", error);
      set({
        categoryExpenseByDateError: "Unable to fetch data. Please try again",
        categoryExpenseByDateLoading: false,
      });
    }
  },
  fetchAccountWithBalances: async (id: string, queryString: string) => {
    console.log(id, queryString);

    set({
      accountWithBalancesLoading: false,
      accountWithBalancesError: null,
    });

    try {
      const response = await axios.get<
        {
          date: string;
          balance: number;
        }[]
      >(`${API_BASE_URL}/accounts/account-with-balances/${id}/?${queryString}`);
      set({
        accountWithBalances: response.data,
        accountWithBalancesLoading: false,
      });
    } catch (error) {
      console.error("Error fetching account with balances", error);
      set({
        accountWithBalancesLoading: false,
        accountWithBalancesError: "Unable to fetch data. Please try again",
      });
    }
  },
  addRecentTransaction: (transaction: Transaction) => {
    set({
      recentTransactions: [
        transaction,
        ...get().recentTransactions.slice(
          0,
          get().recentTransactions.length - 1
        ),
      ],
    });
  },
}));

export default useDashboardStore;
