import Modal from "components/Global/Modal";
import { BaseRecurringTransactionModal } from "../BaseRecurringTransactionModal/BaseRecurringTransactionModal";
import { RawRecurringTransaction } from "types/Transaction";
import { useEditRecurringTransaction } from "../../hooks/useEditRecurringTransaction";
import useTransactionStore from "store/transaction/transactionStore";

type RecurringTransactionModalProps = {
  onClose: () => void;
};

export function EditRecurringTransactionModal({
  onClose,
}: RecurringTransactionModalProps) {
  const { mutate } = useEditRecurringTransaction();
  const { selectedTransactions } = useTransactionStore();

  const handleModalSubmit = (updatedFields: RawRecurringTransaction) => {
    console.log(selectedTransactions.map((t) => t._id));
    mutate({
      recurringTransactionIds: selectedTransactions.map((t) => t._id),
      updatedFields,
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <BaseRecurringTransactionModal
        title="Edit Recurring Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransactions={selectedTransactions}
        mode="edit"
      />
    </Modal>
  );
}
