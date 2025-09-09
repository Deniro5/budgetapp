import {
  getFirstDayOfMonthFormatted,
  getLastDayOfMonthFormatted,
} from "utils/DateUtils";
import { create } from "zustand";
export interface DashboardStore {
  startDate: string;
  endDate: string;
  setStartDate: (newStartDate: string) => void;
  setEndDate: (newEndDate: string) => void;
}

const useDashboardStore = create<DashboardStore>((set) => ({
  startDate: getFirstDayOfMonthFormatted(),
  endDate: getLastDayOfMonthFormatted(),
  setStartDate: (newStartDate) => {
    set({ startDate: newStartDate });
  },
  setEndDate: (newEndDate) => {
    set({ endDate: newEndDate });
  },
}));

export default useDashboardStore;
