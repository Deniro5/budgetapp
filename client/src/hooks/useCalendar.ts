import { useState } from "react";
import {
  getCurrentDateFormatted,
  getDateDaysAgoFormatted,
} from "../utils/DateUtils";

const useCalendar = () => {
  const firstDay = getDateDaysAgoFormatted(30);
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
