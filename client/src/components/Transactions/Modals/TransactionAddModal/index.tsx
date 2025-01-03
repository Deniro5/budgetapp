import Modal from "../../../Global/Modal";
import TransactionBaseModal from "../TransactionBaseModal";
import { RawTransaction, Transaction } from "../../../../types/transaction";
import useTransactionStore from "../../../../zustand/transaction/transactionStore";

type TransactionAddModalProps = {
  onClose: () => void;
  initialTransaction?: Transaction | null;
};

export default function TransactionAddModal({
  onClose,
  initialTransaction,
}: TransactionAddModalProps) {
  const { addTransaction } = useTransactionStore();

  const handleModalSubmit = (transaction: RawTransaction) => {
    addTransaction(transaction);
  };
  return (
    <Modal isOpen={true} onClose={onClose}>
      <TransactionBaseModal
        title="Add Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransaction={initialTransaction}
      />
    </Modal>
  );
}
