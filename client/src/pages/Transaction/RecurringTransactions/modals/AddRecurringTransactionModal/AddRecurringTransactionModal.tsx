import Modal from "components/Global/Modal";
import { BaseRecurringTransactionModal } from "../BaseRecurringTransactionModal/BaseRecurringTransactionModal";
import { RawRecurringTransaction } from "types/Transaction";
import { useAddRecurringTransaction } from "../../hooks/useAddRecurringTransaction";

type RecurringTransactionModalProps = {
  onClose: () => void;
};

export function AddRecurringTransactionModal({
  onClose,
}: RecurringTransactionModalProps) {
  const { mutate } = useAddRecurringTransaction();

  const handleModalSubmit = (transaction: RawRecurringTransaction) => {
    mutate(transaction);
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <BaseRecurringTransactionModal
        title="Add Recurring Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
      />
    </Modal>
  );
}
