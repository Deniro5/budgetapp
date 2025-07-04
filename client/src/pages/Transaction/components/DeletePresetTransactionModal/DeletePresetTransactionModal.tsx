import Modal from "components/Global/Modal";

import { PresetTransaction, Transaction } from "types/Transaction";
import ConfirmModal from "components/Global/ConfirmModal";
import usePresetTransactionStore from "store/presetTransaction/presetTransactionStore";

type DeletePresetTransactionModalProps = {
  transaction: PresetTransaction;
  onClose: () => void;
};

export function DeletePresetTransactionModal({
  transaction,
  onClose,
}: DeletePresetTransactionModalProps) {
  const { deletePresetTransaction } = usePresetTransactionStore();

  const handleConfirm = () => {
    deletePresetTransaction(transaction._id);
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
