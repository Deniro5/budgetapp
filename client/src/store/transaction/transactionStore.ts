import {
  TransactionOverlayType,
  View,
} from "pages/Transaction/transactions.types";
import {
  PresetTransaction,
  Transaction,
  TransactionFilter,
} from "types/Transaction";
import {
  getCurrentDateFormatted,
  getDateDaysAgoFormatted,
} from "utils/DateUtils";
import { create } from "zustand";
export interface TransactionStore {
  startDate: string;
  endDate: string;
  setStartDate: (newStartDate: string) => void;
  setEndDate: (newEndDate: string) => void;
  filter: TransactionFilter;
  setFilter: (newFilter: TransactionFilter) => void;

  sidebarTransactionId: string | null;
  setSidebarTransactionId: (id: string | null) => void;

  activeTransaction: Transaction | PresetTransaction | null;
  setActiveTransaction: (tx: Transaction | PresetTransaction | null) => void;

  activeOverlay: TransactionOverlayType | null;
  setActiveOverlay: (overlay: TransactionOverlayType | null) => void;

  contextMenuPosition: { top: number; left: number };
  setContextMenuPosition: (pos: { top: number; left: number }) => void;

  selectedTransactions: (Transaction | PresetTransaction)[];
  setSelectedTransactions: (txs: (Transaction | PresetTransaction)[]) => void;

  view: View;
  setView: (view: View) => void;

  search: string;
  setSearch: (search: string) => void;
}

const useTransactionStore = create<TransactionStore>((set) => ({
  startDate: getDateDaysAgoFormatted(30),
  endDate: getCurrentDateFormatted(),
  filter: {},
  setStartDate: (newStartDate) => {
    set({ startDate: newStartDate });
  },
  setEndDate: (newEndDate) => {
    set({ endDate: newEndDate });
  },
  setFilter: (newFilter) => {
    set({ filter: newFilter });
  },

  sidebarTransactionId: null,
  setSidebarTransactionId: (id) => set({ sidebarTransactionId: id }),

  activeTransaction: null,
  setActiveTransaction: (tx) => set({ activeTransaction: tx }),

  activeOverlay: null,
  setActiveOverlay: (overlay) => set({ activeOverlay: overlay }),

  contextMenuPosition: { top: 0, left: 0 },
  setContextMenuPosition: (pos) => set({ contextMenuPosition: pos }),

  selectedTransactions: [],
  setSelectedTransactions: (txs) => set({ selectedTransactions: txs }),

  view: "Transactions",
  setView: (view) => set({ view }),

  search: "",
  setSearch: (search) => set({ search }),
}));

export default useTransactionStore;
