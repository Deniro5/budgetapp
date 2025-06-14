import { RawTransaction, RawTransfer, Transaction } from "types/Transaction";
import useTransactionStore from "store/transaction/transactionStore";
import TransferBaseModal from "../TransferBaseModal/TransferBaseModal";
import Modal from "components/Global/Modal";

type TransferCopyModalProps = {
  onClose: () => void;
  initialTransaction: Transaction;
};

export const TransferCopyModal = ({
  onClose,
  initialTransaction,
}: TransferCopyModalProps) => {
  const { addTransfer } = useTransactionStore();

  const handleModalSubmit = (transfer: RawTransfer) => {
    addTransfer(transfer);
  };

  const convertTransactionToTransfer = () => {
    //if the transaction is an income, the sending account is the vendor and the receiving account is the account
    return {
      amount: initialTransaction.amount,
      date: initialTransaction.date,
      sendingAccountId:
        initialTransaction.type === "Income"
          ? initialTransaction.vendor
          : initialTransaction.account,
      receivingAccountId:
        initialTransaction.type === "Income"
          ? initialTransaction.account
          : initialTransaction.vendor,
    };
  };
  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <TransferBaseModal
        title="Copy Transfer"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransfer={convertTransactionToTransfer()}
      />
    </Modal>
  );
};
