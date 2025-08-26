import { useState } from "react";
import PopoverContent from "components/Global/PopoverContent";
import BaseCalendar from "components/Global/BaseCalendar";
import {
  getCurrentDateFormatted,
  getDateDaysAgoFormatted,
  getFirstDayOfMonthFormatted,
  getFirstDayOfYearFormatted,
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
      label: "This Month",
      function: () => {
        setStartDate(getFirstDayOfMonthFormatted());
        setEndDate(getCurrentDateFormatted());
        handleClose();
      },
    },
    {
      label: "This Year",
      function: () => {
        setStartDate(getFirstDayOfYearFormatted());
        setEndDate(getCurrentDateFormatted());
        handleClose();
      },
    },
    {
      label: "Last 30 Days",
      function: () => {
        setStartDate(getDateDaysAgoFormatted(30));
        setEndDate(getCurrentDateFormatted());
        handleClose();
      },
    },
    {
      label: "Last 90 Days",
      function: () => {
        setStartDate(getDateDaysAgoFormatted(90));
        setEndDate(getCurrentDateFormatted());
        handleClose();
      },
    },

    {
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
