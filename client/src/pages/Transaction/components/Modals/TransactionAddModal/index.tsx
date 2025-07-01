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

  //NOTE: addTransactionCallback is not used, And this will prevent recentTransactions from getting latest
  //This should probably be much easier to fix when tanstack is used
  const handleModalSubmit = (
    transaction: RawTransaction,
    callback?: () => void
  ) => {
    addTransaction(transaction, callback);
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
