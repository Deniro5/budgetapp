import { RawTransaction, Transaction } from "types/Transaction";
import { useAddTransaction } from "../../../hooks/useAddTransaction";

import TransactionBaseModal from "../TransactionBaseModal";
import Modal from "components/Global/Modal";

type TransactionCopyModalProps = {
  onClose: () => void;
  initialTransaction: Transaction;
};

export default function TransactionCopyModal({
  onClose,
  initialTransaction,
}: TransactionCopyModalProps) {
  const { mutate } = useAddTransaction();

  const handleModalSubmit = (transaction: RawTransaction) => {
    mutate(transaction);
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
