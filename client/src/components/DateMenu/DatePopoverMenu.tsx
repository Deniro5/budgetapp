import { useState } from "react";
import PopoverContent from "components/Global/PopoverContent";
import BaseCalendar from "components/Global/BaseCalendar";
import {
  getCurrentDateFormatted,
  getDateDaysAgoFormatted,
  getFirstDayOfMonthFormatted,
  getFirstDayOfYearFormatted,
  getLastDayOfMonthFormatted,
  getLastDayOfYearFormatted,
} from "utils/DateUtils";

type DatePopoverMenuProps = {
  setStartDate: (newStartDate: string) => void;
  setEndDate: (newEndDate: string) => void;
  handleClose: () => void;
};
function DatePopoverMenu({
  setStartDate,
  setEndDate,
  handleClose,
}: DatePopoverMenuProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const popoverMenuItems = [
    {
      key: "mtd",
      label: "This Month (to date)",
      function: () => {
        setStartDate(getFirstDayOfMonthFormatted());
        setEndDate(getCurrentDateFormatted());
        handleClose();
      },
    },
    {
      key: "mth",
      label: "This Month (Whole)",
      function: () => {
        setStartDate(getFirstDayOfMonthFormatted());
        setEndDate(getLastDayOfMonthFormatted());
        handleClose();
      },
    },
    {
      key: "ytd",
      label: "This Year (to date)",

      function: () => {
        setStartDate(getFirstDayOfYearFormatted());
        setEndDate(getCurrentDateFormatted());
        handleClose();
      },
    },
    {
      key: "yr",
      label: "This Year (Whole)",
      function: () => {
        setStartDate(getFirstDayOfYearFormatted());
        setEndDate(getLastDayOfYearFormatted());
        handleClose();
      },
    },
    {
      key: "last30",
      label: "Last 30 Days",
      function: () => {
        setStartDate(getDateDaysAgoFormatted(30));
        setEndDate(getCurrentDateFormatted());
        handleClose();
      },
    },
    {
      key: "last90",
      label: "Last 90 Days",
      function: () => {
        setStartDate(getDateDaysAgoFormatted(90));
        setEndDate(getCurrentDateFormatted());
        handleClose();
      },
    },

    {
      key: "custom",
      label: "Custom Range",
      function: () => {
        setIsCalendarOpen(true);
      },
    },
  ];

  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
  };

  const handleSubmit = (startDate: string, endDate: string) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setIsCalendarOpen(false);
  };

  return isCalendarOpen ? (
    <>
      <BaseCalendar
        handleSubmit={handleSubmit}
        handleClose={handleCloseCalendar}
        isOpen
        isRangeCalendar
      />
    </>
  ) : (
    <PopoverContent menuItems={popoverMenuItems} />
  );
}

export default DatePopoverMenu;
