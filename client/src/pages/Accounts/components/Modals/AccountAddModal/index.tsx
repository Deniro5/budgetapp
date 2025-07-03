import Modal from "components/Global/Modal";
import { Account, RawAccount } from "types/account";
import AccountBaseModal from "../AccountBaseModal";
import useAccountStore from "store/account/accountStore";

type AccountAddModalProps = {
  onClose: () => void;
};

export default function AccountAddModal({ onClose }: AccountAddModalProps) {
  const { addAccount } = useAccountStore();

  const handleModalSubmit = (account: RawAccount) => {
    addAccount(account);
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={500}>
      <AccountBaseModal
        title="Add Account"
        onClose={onClose}
        onSubmit={handleModalSubmit}
      />
    </Modal>
  );
}
