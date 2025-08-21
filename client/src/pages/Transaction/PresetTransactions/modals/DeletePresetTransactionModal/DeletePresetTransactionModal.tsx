import Modal from "components/Global/Modal";
import ConfirmModal from "components/Global/ConfirmModal";
import { useDeletePresetTransaction } from "../../hooks/useDeletePresetTransaction";
import useTransactionStore from "store/transaction/transactionStore";

type DeletePresetTransactionModalProps = {
  onClose: () => void;
};

export function DeletePresetTransactionModal({
  onClose,
}: DeletePresetTransactionModalProps) {
  const { mutate } = useDeletePresetTransaction();
  const { selectedTransactions } = useTransactionStore();
  const areMultipleSelected = selectedTransactions.length > 1;

  const handleConfirm = () => {
    mutate(selectedTransactions.map((transaction) => transaction._id));
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ConfirmModal
        handleCancel={onClose}
        handleConfirm={handleConfirm}
        text={`Are you sure you want to delete ${
          areMultipleSelected
            ? "these preset transactions"
            : "this preset transaction"
        }?`}
      />
    </Modal>
  );
}
