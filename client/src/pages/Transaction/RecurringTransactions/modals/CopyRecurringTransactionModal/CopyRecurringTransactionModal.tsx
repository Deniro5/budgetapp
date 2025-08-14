import Modal from "components/Global/Modal";
import { BaseRecurringTransactionModal } from "../BaseRecurringTransactionModal/BaseRecurringTransactionModal";
import {
  RecurringTransaction,
  RawRecurringTransaction,
} from "types/Transaction";
import { useAddRecurringTransaction } from "../../hooks/useAddRecurringTransaction";

type CopyRecurringTransactionModalProps = {
  onClose: () => void;
  initialTransaction: RecurringTransaction;
};

export function CopyRecurringTransactionModal({
  onClose,
  initialTransaction,
}: CopyRecurringTransactionModalProps) {
  const { mutate } = useAddRecurringTransaction();
  const handleModalSubmit = (transaction: RawRecurringTransaction) => {
    mutate(transaction);
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <BaseRecurringTransactionModal
        title="Copy Recurring Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransaction={initialTransaction}
      />
    </Modal>
  );
}
