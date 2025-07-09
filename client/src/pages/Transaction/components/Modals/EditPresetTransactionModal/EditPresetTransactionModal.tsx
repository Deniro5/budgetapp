import Modal from "components/Global/Modal";
import TransactionBaseModal from "../TransactionBaseModal";
import { PresetTransaction, RawPresetTransaction } from "types/Transaction";
import { useUpdatePresetTransaction } from "../../../hooks/useUpdatePresetTransaction";

type PresetTransactionModalProps = {
  onClose: () => void;
  initialTransaction: PresetTransaction;
};

export function EditPresetTransactionModal({
  onClose,
  initialTransaction,
}: PresetTransactionModalProps) {
  const { mutate } = useUpdatePresetTransaction();

  const handleModalSubmit = (transaction: RawPresetTransaction) => {
    mutate({
      presetTransactionId: initialTransaction._id,
      updatedPresetTransaction: transaction,
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <TransactionBaseModal
        title="Edit Preset Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransaction={initialTransaction}
        isPresetModal
      />
    </Modal>
  );
}
