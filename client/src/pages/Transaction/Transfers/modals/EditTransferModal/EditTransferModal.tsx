import { RawTransfer, Transaction } from "types/Transaction";
import Modal from "components/Global/Modal";
import { BaseTransferModal } from "../BaseTransferModal/BaseTransferModal";
import { useUpdateTransfer } from "../../hooks/useEditTransfer";

type EditTransferModalProps = {
  transaction: Transaction;
  onClose: () => void;
};

export function EditTransferModal({
  transaction,
  onClose,
}: EditTransferModalProps) {
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
      <BaseTransferModal
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransfer={convertTransactionToTransfer()}
      />
    </Modal>
  );
}
