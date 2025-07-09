import { RawTransaction } from "types/Transaction";
import TransactionBaseModal from "../TransactionBaseModal";
import Modal from "components/Global/Modal";
import { useAddTransaction } from "../../../hooks/useAddTransaction";

type TransactionAddModalProps = {
  onClose: () => void;
};

export default function TransactionAddModal({
  onClose,
}: TransactionAddModalProps) {
  const { mutate } = useAddTransaction();
  const handleModalSubmit = (transaction: RawTransaction) => {
    mutate(transaction);
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <TransactionBaseModal
        title="Add Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
      />
    </Modal>
  );
}
