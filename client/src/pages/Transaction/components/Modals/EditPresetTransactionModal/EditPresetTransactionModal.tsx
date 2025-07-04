import Modal from "components/Global/Modal";
import TransactionBaseModal from "../TransactionBaseModal";
import { PresetTransaction, RawPresetTransaction } from "types/Transaction";
import usePresetTransactionStore from "store/presetTransaction/presetTransactionStore";

type PresetTransactionModalProps = {
  onClose: () => void;
  initialTransaction: PresetTransaction;
};

export function EditPresetTransactionModal({
  onClose,
  initialTransaction,
}: PresetTransactionModalProps) {
  const { updatePresetTransaction } = usePresetTransactionStore();

  const handleModalSubmit = (transaction: RawPresetTransaction) => {
    updatePresetTransaction(initialTransaction._id, transaction);
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
