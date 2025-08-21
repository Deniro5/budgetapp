import Modal from "components/Global/Modal";
import { BaseTransactionModal } from "../BaseTransactionModal/BaseTransactionModal";
import { BatchEditTransaction } from "types/Transaction";
import { useUpdateTransaction } from "../../hooks/useUpdateTransaction";
import useTransactionStore from "store/transaction/transactionStore";
type EditTransactionModalProps = {
  onClose: () => void;
};

export function EditTransactionModal({ onClose }: EditTransactionModalProps) {
  const { mutate } = useUpdateTransaction();
  const { selectedTransactions } = useTransactionStore();
  const areMultipleSelected = selectedTransactions.length > 1;

  const handleModalSubmit = (updatedFields: BatchEditTransaction) => {
    mutate({
      transactionIds: selectedTransactions.map((t) => t._id),
      updatedFields,
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <BaseTransactionModal
        title={`Edit Transaction${areMultipleSelected ? "s" : ""}`}
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransactions={selectedTransactions}
        confirmText="Update"
        mode="edit"
      />
    </Modal>
  );
}
