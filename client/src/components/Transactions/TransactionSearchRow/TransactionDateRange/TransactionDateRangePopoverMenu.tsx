import PopoverContent from "../../../Global/PopoverContent";

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
    label: "Custom",
    function: () => {
      alert("Last 30 days");
    },
  },
];

function TransactionDateRangePopoverMenu() {
  return <PopoverContent menuItems={popoverMenuItems} />;
}

export default TransactionDateRangePopoverMenu;
