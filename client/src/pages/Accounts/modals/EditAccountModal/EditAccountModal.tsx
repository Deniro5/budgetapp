import Modal from "components/Global/Modal";
import { Account } from "types/account";
import { BaseAccountModal } from "..";
import { useEditAccount } from "../../hooks/useEditAccount";

type EditAccountModalProps = {
  account: Account;
  onClose: () => void;
};

export function EditAccountModal({ account, onClose }: EditAccountModalProps) {
  const { mutate } = useEditAccount();

  const handleModalSubmit = (updatedAccount: Account) => {
    mutate({ accountId: account._id, updatedAccount });
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={500}>
      <BaseAccountModal
        title="Edit Account"
        initialAccount={account}
        onClose={onClose}
        onSubmit={handleModalSubmit}
        confirmText="Save Changes"
      />
    </Modal>
  );
}
