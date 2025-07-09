import Modal from "components/Global/Modal";
import { PresetTransaction } from "types/Transaction";
import ConfirmModal from "components/Global/ConfirmModal";
import { useDeletePresetTransaction } from "../../hooks/useDeletePresetTransaction";

type DeletePresetTransactionModalProps = {
  transaction: PresetTransaction;
  onClose: () => void;
};

export function DeletePresetTransactionModal({
  transaction,
  onClose,
}: DeletePresetTransactionModalProps) {
  const { mutate } = useDeletePresetTransaction();

  const handleConfirm = () => {
    mutate(transaction._id);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ConfirmModal
        handleCancel={onClose}
        handleConfirm={handleConfirm}
        text={"Are you sure you want to delete this preset transaction?"}
      />
    </Modal>
  );
}
