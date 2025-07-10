import React from "react";
import PopoverContent from "components/Global/PopoverContent";
import { Popover } from "react-tiny-popover";
import {
  PresetTransaction,
  Transaction,
  TransactionCategory,
} from "types/Transaction";
import { TransactionOverlayType, View } from "../../../TransactionsPage";
import { isPresetTransaction } from "../../utils";

type TransactionContextMenuProps = {
  activeTransaction: Transaction | PresetTransaction;
  onClose: () => void;
  setActiveOverlay: React.Dispatch<
    React.SetStateAction<TransactionOverlayType | null>
  >;
  top: number;
  left: number;
};

export function TransactionContextMenu({
  activeTransaction,
  onClose,
  setActiveOverlay,
  top,
  left,
}: TransactionContextMenuProps) {
  const isTransfer =
    activeTransaction.category === TransactionCategory.Transfer;
  const isPreset = isPresetTransaction(activeTransaction);
  const transactionLabel = isTransfer ? "Transfer" : "Transaction";
  const presetLabel = isPreset ? "Preset" : " ";

  const editLabel = `Edit ${presetLabel + " " + transactionLabel}`;
  const copyLabel = `Copy ${presetLabel + " " + transactionLabel}`;
  const deleteLabel = `Delete ${presetLabel + " " + transactionLabel}`;

  const menuItems = [
    {
      label: editLabel,
      function: () => {
        handleEditClick();
      },
    },
    {
      label: copyLabel,
      function: () => {
        handleCopyClick();
      },
    },
    {
      label: deleteLabel,
      function: () => {
        handleDeleteClick();
      },
    },
  ];

  const handleEditClick = () => {
    if (isTransfer) setActiveOverlay(TransactionOverlayType.EDIT_TRANSFER);
    else if (isPreset) setActiveOverlay(TransactionOverlayType.EDIT_PRESET);
    else {
      setActiveOverlay(TransactionOverlayType.EDIT);
    }
  };

  const handleDeleteClick = () => {
    if (isTransfer) setActiveOverlay(TransactionOverlayType.DELETE_TRANSFER);
    else if (isPreset) setActiveOverlay(TransactionOverlayType.DELETE_PRESET);
    else {
      setActiveOverlay(TransactionOverlayType.DELETE);
    }
  };

  const handleCopyClick = () => {
    if (isTransfer) setActiveOverlay(TransactionOverlayType.COPY_TRANSFER);
    else if (isPreset) setActiveOverlay(TransactionOverlayType.COPY_PRESET);
    else {
      setActiveOverlay(TransactionOverlayType.COPY);
    }
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
        content={<PopoverContent menuItems={menuItems} width={220} />}
      >
        <></>
      </Popover>
    </>
  );
}
