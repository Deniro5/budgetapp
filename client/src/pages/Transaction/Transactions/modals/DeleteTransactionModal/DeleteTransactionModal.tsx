import Modal from "components/Global/Modal";
import { Transaction } from "types/Transaction";
import ConfirmModal from "components/Global/ConfirmModal";
import { useDeleteTransaction } from "../../hooks/useDeleteTransaction";
import useTransactionStore from "store/transaction/transactionStore";

type DeleteTransactionModalProps = {
  onClose: () => void;
};

export function DeleteTransactionModal({
  onClose,
}: DeleteTransactionModalProps) {
  const { mutate } = useDeleteTransaction();
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
          areMultipleSelected ? "these transactions" : "this transaction"
        }?`}
      />
    </Modal>
  );
}
