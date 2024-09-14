import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseButton } from "../../../../Styles";
import Modal from "../../../Global/Modal";
import useModalController from "../../../Global/Modal/useModalController";
import TransactionBaseModal from "../../TransactionBaseModal";

function TransactionsHeaderAddButton() {
  const { isOpen, closeModal, openModal } = useModalController();

  return (
    <>
      <BaseButton onClick={openModal}>
        <FontAwesomeIcon icon={faAdd} />
        Add Transaction{" "}
      </BaseButton>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <TransactionBaseModal title="Add Transaction" onClose={closeModal} />
      </Modal>
    </>
  );
}

export default TransactionsHeaderAddButton;
