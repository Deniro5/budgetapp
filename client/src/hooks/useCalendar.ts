import { useState } from "react";
import {
  getCurrentDateFormatted,
  getFirstDayOfMonthFormatted,
} from "../utils/DateUtils";

const useCalendar = () => {
  const firstDay = getFirstDayOfMonthFormatted();
  const lastDay = getCurrentDateFormatted();
  const [startDate, setStartDate] = useState<string>(firstDay);
  const [endDate, setEndDate] = useState<string>(lastDay);

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  };
};

export default useCalendar;
