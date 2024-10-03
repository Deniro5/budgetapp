import { faAngleDown, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SecondaryButton } from "../../../../Styles";
import { Popover } from "react-tiny-popover";
import { useRef, useState } from "react";
import TransactionDateRangePopoverMenu from "./TransactionDateRangePopoverMenu";

function TransactionDateRange() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setIsMenuOpen(true);
  };

  return (
    <>
      <Popover
        isOpen={isMenuOpen}
        positions={"bottom"}
        padding={4}
        onClickOutside={() => setIsMenuOpen(false)}
        content={<TransactionDateRangePopoverMenu />}
      >
        <SecondaryButton ref={buttonRef} onClick={(e) => handleButtonClick(e)}>
          <FontAwesomeIcon icon={faCalendar} />
          Dec 21 2024 - Sep 21 2026
          <FontAwesomeIcon icon={faAngleDown} />
        </SecondaryButton>
      </Popover>
    </>
  );
}

export default TransactionDateRange;
