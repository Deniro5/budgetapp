import Modal from "components/Global/Modal";

import ConfirmModal from "components/Global/ConfirmModal";
import { Account } from "types/account";
import { useDeleteAccount } from "../../hooks/useDeleteAccount";

type DeleteAccountButtonProps = {
  account: Account;
  onClose: () => void;
};

export function DeleteAccountModal({
  account,
  onClose,
}: DeleteAccountButtonProps) {
  const { mutate } = useDeleteAccount();

  const handleConfirm = () => {
    mutate(account._id);
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
