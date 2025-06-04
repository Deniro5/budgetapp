import { RawTransaction, Transaction } from "types/Transaction";
import useTransactionStore from "store/transaction/transactionStore";
import TransactionBaseModal from "../TransactionBaseModal";
import Modal from "components/Global/Modal";

type TransactionCopyModalProps = {
  onClose: () => void;
  initialTransaction: Transaction | null;
};

export default function TransactionAddModal({
  onClose,
  initialTransaction,
}: TransactionCopyModalProps) {
  const { addTransaction } = useTransactionStore();

  const handleModalSubmit = (transaction: RawTransaction) => {
    addTransaction(transaction);
  };
  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <TransactionBaseModal
        title="Copy Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransaction={initialTransaction}
      />
    </Modal>
  );
}
