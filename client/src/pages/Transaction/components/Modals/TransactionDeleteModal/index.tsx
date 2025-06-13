import Modal from "components/Global/Modal";
import useTransactionStore from "store/transaction/transactionStore";
import { Transaction, TransactionCategory } from "types/Transaction";
import ConfirmModal from "components/Global/ConfirmModal";

type TransactionDeleteButtonProps = {
  transaction: Transaction;
  onClose: () => void;
};

function TransactionDeleteModal({
  transaction,
  onClose,
}: TransactionDeleteButtonProps) {
  const { deleteTransaction, deleteTransfer } = useTransactionStore();

  const isTransfer = transaction.category === TransactionCategory.Transfer;

  const handleConfirm = () => {
    isTransfer
      ? deleteTransfer(transaction._id)
      : deleteTransaction(transaction._id);
    onClose();
  };

  const text = isTransfer
    ? "This transaction is part of a transfer. Deleting it will also delete the transaction that is paired with this one. Are you sure you want to proceed?"
    : "Are you sure you want to delete this transaction?";

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ConfirmModal
        handleCancel={onClose}
        handleConfirm={handleConfirm}
        text={text}
      />
    </Modal>
  );
}

export default TransactionDeleteModal;
