import Modal from "components/Global/Modal";
import TransactionBaseModal from "../TransactionBaseModal";
import { RawTransaction, Transaction } from "types/Transaction";
import { useUpdateTransaction } from "../../../hooks/useUpdateTransaction";

type TransactionEditModalProps = {
  transaction: Transaction;
  onClose: () => void;
};

export function TransactionEditModal({
  transaction,
  onClose,
}: TransactionEditModalProps) {
  const { mutate } = useUpdateTransaction();

  const handleModalSubmit = (updatedTransaction: RawTransaction) => {
    mutate({ transactionId: transaction._id, updatedTransaction });
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
