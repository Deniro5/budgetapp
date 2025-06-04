import Modal from "components/Global/Modal";
import useTransactionStore from "store/transaction/transactionStore";
import { Transaction } from "types/Transaction";
import ConfirmModal from "components/Global/ConfirmModal";

type TransactionDeleteButtonProps = {
  transaction: Transaction;
  onClose: () => void;
};

function TransactionDeleteModal({
  transaction,
  onClose,
}: TransactionDeleteButtonProps) {
  const { deleteTransaction } = useTransactionStore();

  const handleConfirm = () => {
    deleteTransaction(transaction._id);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ConfirmModal
        handleCancel={onClose}
        handleConfirm={handleConfirm}
        text="Are you sure you want to delete this transaction?"
      />
    </Modal>
  );
}

export default TransactionDeleteModal;
