import { faAngleDown, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SecondaryButton } from "styles";
import { Popover } from "react-tiny-popover";
import { useRef, useState } from "react";
import DatePopoverMenu from "./DatePopoverMenu";

type DateMenuProps = {
  startDate: string;
  endDate: string;
  setStartDate: (newStartDate: string) => void;
  setEndDate: (newEndDate: string) => void;
};

function DateMenu({
  startDate,
  endDate,
  setEndDate,
  setStartDate,
}: DateMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setIsMenuOpen(true);
  };

  const handleClose = () => setIsMenuOpen(false);

  return (
    <>
      <Popover
        isOpen={isMenuOpen}
        positions={"bottom"}
        padding={4}
        onClickOutside={handleClose}
        content={
          <DatePopoverMenu
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            handleClose={handleClose}
          />
        }
      >
        <SecondaryButton ref={buttonRef} onClick={(e) => handleButtonClick(e)}>
          <FontAwesomeIcon icon={faCalendar} />
          {startDate} - {endDate}
          <FontAwesomeIcon icon={faAngleDown} />
        </SecondaryButton>
      </Popover>
    </>
  );
}

export default DateMenu;
