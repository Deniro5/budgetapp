import Modal from "components/Global/Modal";
import { Account } from "types/account";
import AccountBaseModal from "../AccountBaseModal";
import useAccountStore from "store/account/accountStore";

type AccountEditModalProps = {
  account: Account;
  onClose: () => void;
};

export default function AccountEditModal({
  account,
  onClose,
}: AccountEditModalProps) {
  const { updateAccount } = useAccountStore();

  const handleModalSubmit = (updatedAccount: Account) => {
    updateAccount(account._id, updatedAccount);
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={500}>
      <AccountBaseModal
        title="Edit Account"
        initialAccount={account}
        onClose={onClose}
        onSubmit={handleModalSubmit}
        confirmText="Save Changes"
      />
    </Modal>
  );
}
