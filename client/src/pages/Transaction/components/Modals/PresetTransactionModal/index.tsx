import Modal from "components/Global/Modal";
import TransactionBaseModal from "../TransactionBaseModal";
import { PresetTransaction, RawPresetTransaction } from "types/Transaction";
import usePresetTransactionStore from "store/presetTransaction/presetTransactionStore";

type PresetTransactionModalProps = {
  onClose: () => void;
  initialTransaction?: PresetTransaction | null;
};

export default function PresetTransactionModal({
  onClose,
  initialTransaction,
}: PresetTransactionModalProps) {
  const { addPresetTransaction } = usePresetTransactionStore();

  const handleModalSubmit = (transaction: RawPresetTransaction) => {
    addPresetTransaction(transaction);
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <TransactionBaseModal
        title="Add Preset Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransaction={undefined}
        isPresetModal
      />
    </Modal>
  );
}
