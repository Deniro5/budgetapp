import { RawTransaction, Transaction } from "types/Transaction";
import useTransactionStore from "store/transaction/transactionStore";
import TransactionBaseModal from "../TransactionBaseModal";
import Modal from "components/Global/Modal";

type TransactionAddModalProps = {
  onClose: () => void;
  addTransactionCallback?: (transaction: Transaction) => void;
};

export default function TransactionAddModal({
  onClose,
  addTransactionCallback,
}: TransactionAddModalProps) {
  const { addTransaction } = useTransactionStore();

  const handleModalSubmit = (transaction: RawTransaction) => {
    addTransaction(transaction, addTransactionCallback);
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <TransactionBaseModal
        title="Add Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
      />
    </Modal>
  );
}
