import Modal from "components/Global/Modal";
import ConfirmModal from "components/Global/ConfirmModal";
import { useDeleteRecurringTransaction } from "../../hooks/useDeleteRecurringTransaction";
import useTransactionStore from "store/transaction/transactionStore";

type DeleteRecurringTransactionModalProps = {
  onClose: () => void;
};

export function DeleteRecurringTransactionModal({
  onClose,
}: DeleteRecurringTransactionModalProps) {
  const { mutate } = useDeleteRecurringTransaction();
  const { selectedTransactions } = useTransactionStore();
  const areMultipleSelected = selectedTransactions.length > 1;

  const handleConfirm = () => {
    mutate(selectedTransactions.map((transaction) => transaction._id));
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ConfirmModal
        handleCancel={onClose}
        handleConfirm={handleConfirm}
        text={`Are you sure you want to delete ${
          areMultipleSelected
            ? "these recurring transactions"
            : "this recurring transaction"
        }?`}
      />
    </Modal>
  );
}
