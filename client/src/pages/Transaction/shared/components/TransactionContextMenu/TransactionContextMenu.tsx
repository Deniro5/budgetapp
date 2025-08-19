import PopoverContent from "components/Global/PopoverContent";
import { Popover } from "react-tiny-popover";
import { TransactionCategory } from "types/Transaction";
import { TransactionOverlayType, View } from "../../../transactions.types";
import useTransactionStore from "store/transaction/transactionStore";

type TransactionContextMenuProps = {
  onClose: () => void;
};

export function TransactionContextMenu({
  onClose,
}: TransactionContextMenuProps) {
  const { setActiveOverlay, activeTransaction, view, contextMenuPosition } =
    useTransactionStore();

  if (!activeTransaction) return null;
  const isTransfer =
    activeTransaction.category === TransactionCategory.Transfer;

  const getTransactionLabel = () => {
    if (view === "Recurring") return "Recurring Transaction";
    if (view === "Preset") return "Preset Transaction";
    if (isTransfer) return "Transfer";
    return "Transaction";
  };

  const transactionLabel = getTransactionLabel();

  const editLabel = `Edit ${transactionLabel}`;
  const copyLabel = `Copy ${transactionLabel}`;
  const deleteLabel = `Delete ${transactionLabel}`;

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
    if (view === "Recurring")
      setActiveOverlay(TransactionOverlayType.EDIT_RECURRING);
    else if (view === "Preset")
      setActiveOverlay(TransactionOverlayType.EDIT_PRESET);
    else {
      if (isTransfer) setActiveOverlay(TransactionOverlayType.EDIT_TRANSFER);
      else setActiveOverlay(TransactionOverlayType.EDIT);
    }
  };

  const handleDeleteClick = () => {
    if (view === "Recurring")
      setActiveOverlay(TransactionOverlayType.DELETE_RECURRING);
    else if (view === "Preset")
      setActiveOverlay(TransactionOverlayType.DELETE_PRESET);
    else {
      if (isTransfer) setActiveOverlay(TransactionOverlayType.DELETE_TRANSFER);
      else setActiveOverlay(TransactionOverlayType.DELETE);
    }
  };

  const handleCopyClick = () => {
    if (view === "Recurring")
      setActiveOverlay(TransactionOverlayType.COPY_RECURRING);
    else if (view === "Preset")
      setActiveOverlay(TransactionOverlayType.COPY_PRESET);
    else {
      if (isTransfer) setActiveOverlay(TransactionOverlayType.COPY_TRANSFER);
      else setActiveOverlay(TransactionOverlayType.COPY);
    }
  };

  const getWidth = () => {
    if (view === "Recurring" || view === "Preset") return 240;
    return 200;
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
          top: `${contextMenuPosition.top}px`,
          left: `${contextMenuPosition.left}px`,
          position: "absolute",
        }}
        content={<PopoverContent menuItems={menuItems} width={getWidth()} />}
      >
        <></>
      </Popover>
    </>
  );
}
