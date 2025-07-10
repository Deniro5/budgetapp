import Modal from "components/Global/Modal";
import { BasePresetTransactionModal } from "../BasePresetTransactionModal/BasePresetTransactionModal";
import { PresetTransaction, RawPresetTransaction } from "types/Transaction";
import { useEditPresetTransaction } from "../../hooks/useEditPresetTransaction";

type PresetTransactionModalProps = {
  onClose: () => void;
  initialTransaction: PresetTransaction;
};

export function EditPresetTransactionModal({
  onClose,
  initialTransaction,
}: PresetTransactionModalProps) {
  const { mutate } = useEditPresetTransaction();

  const handleModalSubmit = (transaction: RawPresetTransaction) => {
    mutate({
      presetTransactionId: initialTransaction._id,
      updatedPresetTransaction: transaction,
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <BasePresetTransactionModal
        title="Edit Preset Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransaction={initialTransaction}
      />
    </Modal>
  );
}
