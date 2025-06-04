import { faAngleDown, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseButton } from "styles";
import { Popover } from "react-tiny-popover";
import { useState } from "react";
import TransactionFilterPopoverMenu from "./TransactionFilterPopoverMenu";
import { TransactionFilter } from "types/Transaction";

type TransactionFilterButtonProps = {
  filter: TransactionFilter;
  setFilter: React.Dispatch<React.SetStateAction<TransactionFilter>>;
};

function TransactionFilterButton({
  filter,
  setFilter,
}: TransactionFilterButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setIsMenuOpen(true);
  };

  const handleClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <Popover
        isOpen={isMenuOpen}
        positions={"bottom"}
        padding={4}
        onClickOutside={handleClose}
        content={
          <TransactionFilterPopoverMenu
            filter={filter}
            setFilter={setFilter}
            handleClose={handleClose}
          />
        }
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
