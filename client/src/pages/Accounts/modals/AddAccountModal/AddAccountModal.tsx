import Modal from "components/Global/Modal";
import { RawAccount } from "types/account";
import { useAddAccount } from "../../hooks/useAddAccount";
import { BaseAccountModal } from "..";

type AddAccountModalProps = {
  onClose: () => void;
};

export function AddAccountModal({ onClose }: AddAccountModalProps) {
  const { mutate } = useAddAccount();

  const handleModalSubmit = (account: RawAccount) => {
    mutate(account);
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={500}>
      <BaseAccountModal
        title="Add Account"
        onClose={onClose}
        onSubmit={handleModalSubmit}
      />
    </Modal>
  );
}
