import Modal from "components/Global/Modal";
import TransactionBaseModal from "../TransactionBaseModal";
import { PresetTransaction, RawPresetTransaction } from "types/Transaction";
import usePresetTransactionStore from "store/presetTransaction/presetTransactionStore";

type CopyPresetTransactionModalProps = {
  onClose: () => void;
  initialTransaction: PresetTransaction;
};

export function CopyPresetTransactionModal({
  onClose,
  initialTransaction,
}: CopyPresetTransactionModalProps) {
  const { addPresetTransaction } = usePresetTransactionStore();

  const handleModalSubmit = (transaction: RawPresetTransaction) => {
    addPresetTransaction(transaction);
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <TransactionBaseModal
        title="Copy Preset Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransaction={initialTransaction}
        isPresetModal
      />
    </Modal>
  );
}
