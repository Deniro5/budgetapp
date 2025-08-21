import Modal from "components/Global/Modal";
import { BasePresetTransactionModal } from "../BasePresetTransactionModal/BasePresetTransactionModal";
import { PresetTransaction, RawPresetTransaction } from "types/Transaction";
import { useAddPresetTransaction } from "../../hooks/useAddPresetTransaction";

type CopyPresetTransactionModalProps = {
  onClose: () => void;
  initialTransaction: PresetTransaction;
};

export function CopyPresetTransactionModal({
  onClose,
  initialTransaction,
}: CopyPresetTransactionModalProps) {
  const { mutate } = useAddPresetTransaction();
  const handleModalSubmit = (transaction: RawPresetTransaction) => {
    mutate(transaction);
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <BasePresetTransactionModal
        title="Copy Preset Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransactions={[initialTransaction]}
        mode="create"
      />
    </Modal>
  );
}
