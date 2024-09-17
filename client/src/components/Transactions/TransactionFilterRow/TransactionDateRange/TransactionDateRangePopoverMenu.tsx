import { useState } from "react";
import PopoverContent from "../../../Global/PopoverContent";
import BaseCalendar from "../../../Global/BaseCalendar";

function TransactionDateRangePopoverMenu() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  //this probably shouldnt be here
  const popoverMenuItems = [
    {
      label: "Last 30 Days",
      function: () => {
        alert("Last 30 days");
      },
    },
    {
      label: "Last 90 Days",
      function: () => {
        alert("Last 30 days");
      },
    },
    {
      label: "This Month",
      function: () => {
        alert("Last 30 days");
      },
    },
    {
      label: "This Year",
      function: () => {
        alert("Last 30 days");
      },
    },
    {
      label: "Custom Range",
      function: () => {
        setIsCalendarOpen(true);
      },
    },
  ];

  const handleClose = () => {
    setIsCalendarOpen(false);
  };

  const handleSubmit = () => {
    //have to add the missing stuff
    setIsCalendarOpen(false);
  };

  return isCalendarOpen ? (
    <>
      <BaseCalendar
        handleSubmit={handleSubmit}
        handleClose={handleClose}
        isOpen
        isRangeCalendar
      />
    </>
  ) : (
    <PopoverContent menuItems={popoverMenuItems} />
  );
}

export default TransactionDateRangePopoverMenu;
