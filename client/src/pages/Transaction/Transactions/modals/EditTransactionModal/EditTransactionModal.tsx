import Modal from "components/Global/Modal";
import { BaseTransactionModal } from "../BaseTransactionModal/BaseTransactionModal";
import { RawTransaction, Transaction } from "types/Transaction";
import { useUpdateTransaction } from "../../hooks/useUpdateTransaction";

type EditTransactionModalProps = {
  transaction: Transaction;
  onClose: () => void;
};

export function EditTransactionModal({
  transaction,
  onClose,
}: EditTransactionModalProps) {
  const { mutate } = useUpdateTransaction();

  const handleModalSubmit = (updatedTransaction: RawTransaction) => {
    mutate({ transactionId: transaction._id, updatedTransaction });
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <BaseTransactionModal
        title="Edit Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransaction={transaction}
        confirmText="Update"
      />
    </Modal>
  );
}
