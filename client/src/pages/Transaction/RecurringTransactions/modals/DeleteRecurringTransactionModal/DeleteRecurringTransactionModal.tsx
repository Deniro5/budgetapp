import Modal from "components/Global/Modal";
import { RecurringTransaction } from "types/Transaction";
import ConfirmModal from "components/Global/ConfirmModal";
import { useDeleteRecurringTransaction } from "../../hooks/useDeleteRecurringTransaction";

type DeleteRecurringTransactionModalProps = {
  transaction: RecurringTransaction;
  onClose: () => void;
};

export function DeleteRecurringTransactionModal({
  transaction,
  onClose,
}: DeleteRecurringTransactionModalProps) {
  const { mutate } = useDeleteRecurringTransaction();

  const handleConfirm = () => {
    mutate(transaction._id);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ConfirmModal
        handleCancel={onClose}
        handleConfirm={handleConfirm}
        text={"Are you sure you want to delete this recurring transaction?"}
      />
    </Modal>
  );
}
