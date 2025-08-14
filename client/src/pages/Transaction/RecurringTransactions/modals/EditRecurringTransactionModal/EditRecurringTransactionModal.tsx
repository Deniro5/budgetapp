import Modal from "components/Global/Modal";
import { BaseRecurringTransactionModal } from "../BaseRecurringTransactionModal/BaseRecurringTransactionModal";
import {
  RecurringTransaction,
  RawRecurringTransaction,
} from "types/Transaction";
import { useEditRecurringTransaction } from "../../hooks/useEditRecurringTransaction";

type RecurringTransactionModalProps = {
  onClose: () => void;
  initialTransaction: RecurringTransaction;
};

export function EditRecurringTransactionModal({
  onClose,
  initialTransaction,
}: RecurringTransactionModalProps) {
  const { mutate } = useEditRecurringTransaction();

  const handleModalSubmit = (transaction: RawRecurringTransaction) => {
    mutate({
      recurringTransactionId: initialTransaction._id,
      updatedRecurringTransaction: transaction,
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <BaseRecurringTransactionModal
        title="Edit Recurring Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransaction={initialTransaction}
      />
    </Modal>
  );
}
