import Modal from "components/Global/Modal";
import { Transaction } from "types/Transaction";
import ConfirmModal from "components/Global/ConfirmModal";
import { useDeleteTransfer } from "../../hooks/useDeleteTransfer";

type DeleteTransferModalProps = {
  transaction: Transaction;
  onClose: () => void;
};

export function DeleteTransferModal({
  transaction,
  onClose,
}: DeleteTransferModalProps) {
  const { mutate } = useDeleteTransfer();

  const handleConfirm = () => {
    mutate(transaction._id);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ConfirmModal
        handleCancel={onClose}
        handleConfirm={handleConfirm}
        text={
          "This transaction is part of a transfer. Deleting it will also delete the transaction that is paired with this one. Are you sure you want to proceed?"
        }
      />
    </Modal>
  );
}
