import Modal from "components/Global/Modal";
import TransactionBaseModal from "../TransactionBaseModal";
import useTransactionStore from "store/transaction/transactionStore";
import { RawTransaction, Transaction } from "types/Transaction";

type TransactionEditModalProps = {
  transaction: Transaction;
  onClose: () => void;
};

function TransactionEditModal({
  transaction,
  onClose,
}: TransactionEditModalProps) {
  const { updateTransaction } = useTransactionStore();

  const handleModalSubmit = (updatedTransaction: RawTransaction) => {
    updateTransaction(transaction._id, updatedTransaction);
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <TransactionBaseModal
        title="Edit Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransaction={transaction}
        confirmText="Update"
      />
    </Modal>
  );
}

export default TransactionEditModal;
