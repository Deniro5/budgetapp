import { faAngleDown, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseButton } from "../../../../Styles";
import { Popover } from "react-tiny-popover";
import { useState } from "react";
import TransactionFilterPopoverMenu from "./TransactionFilterPopoverMenu";

function TransactionFilterButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        content={<TransactionFilterPopoverMenu />}
      >
        <BaseButton onClick={(e) => handleButtonClick(e)}>
          <FontAwesomeIcon icon={faFilter} />
          Filter
          <FontAwesomeIcon icon={faAngleDown} />
        </BaseButton>
      </Popover>
    </>
  );
}

export default TransactionFilterButton;
