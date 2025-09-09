import Modal from "components/Global/Modal";
import { BaseRecurringTransactionModal } from "../BaseRecurringTransactionModal/BaseRecurringTransactionModal";
import { RawRecurringTransaction } from "types/Transaction";
import { useAddRecurringTransaction } from "../../hooks/useAddRecurringTransaction";
import useTransactionStore from "store/transaction/transactionStore";

type CopyRecurringTransactionModalProps = {
  onClose: () => void;
};

export function CopyRecurringTransactionModal({
  onClose,
}: CopyRecurringTransactionModalProps) {
  const { mutate } = useAddRecurringTransaction();
  const { selectedTransactions } = useTransactionStore();

  const handleModalSubmit = (transaction: RawRecurringTransaction) => {
    mutate(transaction);
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <BaseRecurringTransactionModal
        title="Copy Recurring Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransactions={selectedTransactions.slice(0, 1)}
      />
    </Modal>
  );
}
