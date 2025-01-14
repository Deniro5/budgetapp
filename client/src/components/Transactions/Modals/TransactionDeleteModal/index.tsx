import { faAdd, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseButton } from "../../../../Styles";
import Modal from "../../../Global/Modal";
import useModalController from "../../../Global/Modal/useModalController";
import TransactionBaseModal from "../../Modals/TransactionBaseModal";
import useTransactionStore from "../../../../zustand/transaction/transactionStore";
import { RawTransaction, Transaction } from "../../types";
import ConfirmModal from "../../../Global/ConfirmModal";

type TransactionDeleteButtonProps = {
  transaction: Transaction;
  onClose: () => void;
};

function TransactionDeleteModal({
  transaction,
  onClose,
}: TransactionDeleteButtonProps) {
  const { deleteTransaction } = useTransactionStore();

  const handleConfirm = () => {
    deleteTransaction(transaction._id);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ConfirmModal
        handleCancel={onClose}
        handleConfirm={handleConfirm}
        text="Are you sure you want to delete this transaction?"
      />
    </Modal>
  );
}

export default TransactionDeleteModal;
