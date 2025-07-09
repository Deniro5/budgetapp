import Modal from "components/Global/Modal";
import TransactionBaseModal from "../TransactionBaseModal";
import { PresetTransaction, RawPresetTransaction } from "types/Transaction";
import { useAddPresetTransaction } from "../../../hooks/useAddPresetTransaction";

type PresetTransactionModalProps = {
  onClose: () => void;
  initialTransaction?: PresetTransaction | null;
};

export function AddPresetTransactionModal({
  onClose,
  initialTransaction,
}: PresetTransactionModalProps) {
  const { mutate } = useAddPresetTransaction();

  const handleModalSubmit = (transaction: RawPresetTransaction) => {
    mutate(transaction);
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
