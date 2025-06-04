import Modal from "components/Global/Modal";

import ConfirmModal from "components/Global/ConfirmModal";
import useAccountStore from "store/account/accountStore";
import { Account } from "types/account";

type AccountDeleteButtonProps = {
  account: Account;
  onClose: () => void;
};

function AccountDeleteModal({ account, onClose }: AccountDeleteButtonProps) {
  const { deleteAccount } = useAccountStore();

  const handleConfirm = () => {
    deleteAccount(account._id);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ConfirmModal
        handleCancel={onClose}
        handleConfirm={handleConfirm}
        text="Are you sure you want to delete this Account?"
      />
    </Modal>
  );
}

export default AccountDeleteModal;
