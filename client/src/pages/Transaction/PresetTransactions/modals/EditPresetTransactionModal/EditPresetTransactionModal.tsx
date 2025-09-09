import Modal from "components/Global/Modal";
import { BasePresetTransactionModal } from "../BasePresetTransactionModal/BasePresetTransactionModal";
import { PresetTransaction, RawPresetTransaction } from "types/Transaction";
import { useEditPresetTransaction } from "../../hooks/useEditPresetTransaction";
import useTransactionStore from "store/transaction/transactionStore";

type PresetTransactionModalProps = {
  onClose: () => void;
};

export function EditPresetTransactionModal({
  onClose,
}: PresetTransactionModalProps) {
  const { mutate } = useEditPresetTransaction();
  const { selectedTransactions } = useTransactionStore();

  const handleModalSubmit = (updatedFields: Partial<RawPresetTransaction>) => {
    mutate({
      presetTransactionIds: selectedTransactions.map((t) => t._id),
      updatedFields,
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <BasePresetTransactionModal
        title="Edit Preset Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransactions={selectedTransactions as PresetTransaction[]}
        mode="edit"
      />
    </Modal>
  );
}
