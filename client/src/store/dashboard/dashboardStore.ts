import {
  getCurrentDateFormatted,
  getDateDaysAgoFormatted,
} from "utils/DateUtils";
import { create } from "zustand";
export interface DashboardStore {
  startDate: string;
  endDate: string;
  setStartDate: (newStartDate: string) => void;
  setEndDate: (newEndDate: string) => void;
}

const useDashboardStore = create<DashboardStore>((set) => ({
  startDate: getDateDaysAgoFormatted(30),
  endDate: getCurrentDateFormatted(),
  setStartDate: (newStartDate) => {
    set({ startDate: newStartDate });
  },
  setEndDate: (newEndDate) => {
    set({ endDate: newEndDate });
  },
}));

export default useDashboardStore;
