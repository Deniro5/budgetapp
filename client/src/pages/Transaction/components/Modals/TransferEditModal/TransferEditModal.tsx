import { RawTransfer, Transaction } from "types/Transaction";
import Modal from "components/Global/Modal";
import TransferBaseModal from "../TransferBaseModal/TransferBaseModal";
import { useUpdateTransfer } from "../../../hooks/useUpdateTransfer";

type TransferEditModalProps = {
  transaction: Transaction;
  onClose: () => void;
};

export default function TransactionEditModal({
  transaction,
  onClose,
}: TransferEditModalProps) {
  const { mutate } = useUpdateTransfer();

  const handleModalSubmit = (updatedTransfer: RawTransfer) => {
    mutate({ transactionId: transaction._id, updatedTransfer });
  };

  const convertTransactionToTransfer = () => {
    //if the transaction is an income, the sending account is the vendor and the receiving account is the account
    return {
      amount: transaction.amount,
      date: transaction.date,
      sendingAccountId:
        transaction.type === "Income"
          ? transaction.vendor
          : transaction.account._id,
      receivingAccountId:
        transaction.type === "Income"
          ? transaction.account._id
          : transaction.vendor,
    };
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <TransferBaseModal
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransfer={convertTransactionToTransfer()}
      />
    </Modal>
  );
}
