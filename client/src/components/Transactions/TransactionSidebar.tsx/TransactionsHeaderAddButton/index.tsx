import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseButton } from "../../../../Styles";
import Modal from "../../../Global/Modal";
import useModalController from "../../../Global/Modal/useModalController";
import TransactionBaseModal from "../../Modals/TransactionBaseModal";
import useTransactionStore from "../../../../zustand/transaction/transactionStore";
import { Transaction } from "../../../../types/transaction";

function TransactionsHeaderAddButton() {
  const { isOpen, closeModal, openModal } = useModalController();
  const { addTransaction } = useTransactionStore();

  const handleModalSubmit = (transaction: Transaction) => {
    addTransaction(transaction);
  };

  return (
    <>
      <BaseButton onClick={openModal}>
        <FontAwesomeIcon icon={faAdd} />
        Add Transaction{" "}
      </BaseButton>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <TransactionBaseModal
          title="Add Transaction"
          onClose={closeModal}
          onSubmit={handleModalSubmit}
        />
      </Modal>
    </>
  );
}

export default TransactionsHeaderAddButton;
