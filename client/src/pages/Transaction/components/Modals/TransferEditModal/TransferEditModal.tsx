import { RawTransfer, Transaction } from "types/Transaction";
import useTransactionStore from "store/transaction/transactionStore";

import Modal from "components/Global/Modal";
import TransferBaseModal from "../TransferBaseModal/TransferBaseModal";

type TransferEditModalProps = {
  transaction: Transaction;
  onClose: () => void;
};

export default function TransactionEditModal({
  transaction,
  onClose,
}: TransferEditModalProps) {
  const { updateTransferByTransactionId } = useTransactionStore();

  const handleModalSubmit = (transfer: RawTransfer) => {
    updateTransferByTransactionId(transaction._id, transfer);
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
