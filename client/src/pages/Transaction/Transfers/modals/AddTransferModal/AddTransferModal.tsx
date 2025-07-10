import { RawTransfer } from "types/Transaction";
import Modal from "components/Global/Modal";
import { BaseTransferModal } from "../BaseTransferModal/BaseTransferModal";
import { useAddTransfer } from "../../hooks/useAddTransfer";

type AddTransferModalProps = {
  onClose: () => void;
};

export function AddTransferModal({ onClose }: AddTransferModalProps) {
  const { mutate } = useAddTransfer();

  const handleModalSubmit = (transfer: RawTransfer) => {
    mutate(transfer);
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <BaseTransferModal onClose={onClose} onSubmit={handleModalSubmit} />
    </Modal>
  );
}
