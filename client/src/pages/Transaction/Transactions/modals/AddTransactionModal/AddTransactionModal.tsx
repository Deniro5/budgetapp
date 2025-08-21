import { RawTransaction } from "types/Transaction";
import { BaseTransactionModal } from "../BaseTransactionModal/BaseTransactionModal";
import Modal from "components/Global/Modal";
import { useAddTransaction } from "../../hooks/useAddTransaction";

type AddTransactionModalProps = {
  onClose: () => void;
};

export function AddTransactionModal({ onClose }: AddTransactionModalProps) {
  const { mutate } = useAddTransaction();
  const handleModalSubmit = (transaction: RawTransaction) => {
    mutate(transaction);
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <BaseTransactionModal
        title="Add Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        mode="create"
      />
    </Modal>
  );
}
