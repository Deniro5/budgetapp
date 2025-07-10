import Modal from "components/Global/Modal";
import { Transaction } from "types/Transaction";
import ConfirmModal from "components/Global/ConfirmModal";
import { useDeleteTransaction } from "../../hooks/useDeleteTransaction";

type DeleteTransactionModalProps = {
  transaction: Transaction;
  onClose: () => void;
};

export function DeleteTransactionModal({
  transaction,
  onClose,
}: DeleteTransactionModalProps) {
  const { mutate } = useDeleteTransaction();

  const handleConfirm = () => {
    mutate(transaction._id);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ConfirmModal
        handleCancel={onClose}
        handleConfirm={handleConfirm}
        text={"Are you sure you want to delete this transaction?"}
      />
    </Modal>
  );
}
