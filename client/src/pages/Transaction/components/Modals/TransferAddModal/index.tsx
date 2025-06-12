import { RawTransfer, Transaction } from "types/Transaction";
import useTransactionStore from "store/transaction/transactionStore";

import Modal from "components/Global/Modal";
import TransferBaseModal from "../TransferBaseModal/TransferBaseModal";

type TransferAddModalProps = {
  onClose: () => void;
  addTransferCallback?: (transaction: Transaction) => void;
};

export default function TransactionAddModal({
  onClose,
  addTransferCallback,
}: TransferAddModalProps) {
  const { addTransfer } = useTransactionStore();

  const handleModalSubmit = (transfer: RawTransfer) => {
    addTransfer(transfer, addTransferCallback);
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <TransferBaseModal onClose={onClose} onSubmit={handleModalSubmit} />
    </Modal>
  );
}
