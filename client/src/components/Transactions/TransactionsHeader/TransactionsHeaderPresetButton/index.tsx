import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Modal from "../../../Global/Modal";
import useModalController from "../../../Global/Modal/useModalController";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { SecondaryButton } from "../../../../Styles";
import TransactionBaseModal from "../../Modals/TransactionBaseModal";

function TransactionsHeaderPresetButton() {
  const { isOpen, closeModal, openModal } = useModalController();

  return (
    <>
      <SecondaryButton onClick={openModal}>
        <FontAwesomeIcon icon={faFolderPlus} />
        Manage Preset Transactions
      </SecondaryButton>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <TransactionBaseModal
          showPresetNameField
          onClose={closeModal}
          title="Add Preset Transaction"
          confirmText="Save Transaction"
        />
      </Modal>
    </>
  );
}

export default TransactionsHeaderPresetButton;
