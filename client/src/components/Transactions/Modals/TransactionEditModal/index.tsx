import { faAdd, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseButton } from "../../../../Styles";
import Modal from "../../../Global/Modal";
import useModalController from "../../../Global/Modal/useModalController";
import TransactionBaseModal from "../../Modals/TransactionBaseModal";
import useTransactionStore from "../../../../zustand/transaction/transactionStore";
import { RawTransaction, Transaction } from "../../../../types/transaction";

type TransactionEditModalProps = {
  transaction: Transaction;
  onClose: () => void;
};

function TransactionEditModal({
  transaction,
  onClose,
}: TransactionEditModalProps) {
  const { updateTransaction } = useTransactionStore();

  const handleModalSubmit = (updatedTransaction: RawTransaction) => {
    updateTransaction(transaction._id, updatedTransaction);
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <TransactionBaseModal
        title="Edit Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransaction={transaction}
        confirmText="Update"
      />
    </Modal>
  );
}

export default TransactionEditModal;
