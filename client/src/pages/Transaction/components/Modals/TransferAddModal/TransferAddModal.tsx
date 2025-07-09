import { RawTransfer } from "types/Transaction";
import Modal from "components/Global/Modal";
import TransferBaseModal from "../TransferBaseModal/TransferBaseModal";
import { useAddTransfer } from "../../../hooks/useAddTransfer";

type TransferAddModalProps = {
  onClose: () => void;
};

export function TransferAddModal({ onClose }: TransferAddModalProps) {
  const { mutate } = useAddTransfer();

  const handleModalSubmit = (transfer: RawTransfer) => {
    mutate(transfer);
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <TransferBaseModal onClose={onClose} onSubmit={handleModalSubmit} />
    </Modal>
  );
}
