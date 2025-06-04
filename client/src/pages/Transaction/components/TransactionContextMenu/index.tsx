import React from "react";
import PopoverContent from "components/Global/PopoverContent";
import { Popover } from "react-tiny-popover";
import { Transaction } from "types/Transaction";
import { TransactionOverlayType } from "../../Transactions";

type TransactionContextMenuProps = {
  activeTransaction: Transaction;
  onClose: () => void;
  setActiveOverlay: React.Dispatch<
    React.SetStateAction<TransactionOverlayType | null>
  >;
  top: number;
  left: number;
};

export default function TransactionContextMenu({
  activeTransaction,
  onClose,
  setActiveOverlay,
  top,
  left,
}: TransactionContextMenuProps) {
  const menuItems = [
    {
      label: "Edit Transaction",
      function: () => {
        handleEditClick();
      },
    },
    {
      label: "Copy Transaction",
      function: () => {
        handleCopyClick();
      },
    },
    {
      label: "Delete Transaction",
      function: () => {
        handleDeleteClick();
      },
    },
  ];

  const handleEditClick = () => {
    setActiveOverlay(TransactionOverlayType.EDIT);
  };

  const handleDeleteClick = () => {
    setActiveOverlay(TransactionOverlayType.DELETE);
  };

  const handleCopyClick = () => {
    setActiveOverlay(TransactionOverlayType.COPY);
  };

  const handleOutsideClick = () => {
    onClose();
  };

  return (
    <>
      <Popover
        isOpen={true}
        positions={"bottom"}
        padding={4}
        onClickOutside={handleOutsideClick}
        containerStyle={{
          top: `${top}px`,
          left: `${left}px`,
          position: "absolute",
        }}
        content={<PopoverContent menuItems={menuItems} />}
      >
        <></>
      </Popover>
    </>
  );
}
