import { RawTransfer, Transaction } from "types/Transaction";
import { BaseTransferModal } from "../BaseTransferModal/BaseTransferModal";
import Modal from "components/Global/Modal";
import { useAddTransfer } from "../../hooks/useAddTransfer";

type CopyTransferModalProps = {
  onClose: () => void;
  initialTransaction: Transaction;
};

export const CopyTransferModal = ({
  onClose,
  initialTransaction,
}: CopyTransferModalProps) => {
  const { mutate } = useAddTransfer();

  const handleModalSubmit = (transfer: RawTransfer) => {
    mutate(transfer);
  };

  const convertTransactionToTransfer = () => {
    //if the transaction is an income, the sending account is the vendor and the receiving account is the account
    return {
      amount: initialTransaction.amount,
      date: initialTransaction.date,
      sendingAccountId:
        initialTransaction.type === "Income"
          ? initialTransaction.vendor
          : initialTransaction.account._id,
      receivingAccountId:
        initialTransaction.type === "Income"
          ? initialTransaction.account._id
          : initialTransaction.vendor,
    };
  };
  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <BaseTransferModal
        title="Copy Transfer"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransfer={convertTransactionToTransfer()}
      />
    </Modal>
  );
};
