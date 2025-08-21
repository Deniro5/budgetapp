import { RawTransaction, Transaction } from "types/Transaction";
import { useAddTransaction } from "../../hooks/useAddTransaction";

import { BaseTransactionModal } from "../BaseTransactionModal/BaseTransactionModal";
import Modal from "components/Global/Modal";

type CopyTransactionModalProps = {
  onClose: () => void;
  initialTransaction: Transaction;
};

export function CopyTransactionModal({
  onClose,
  initialTransaction,
}: CopyTransactionModalProps) {
  const { mutate } = useAddTransaction();

  const handleModalSubmit = (transaction: RawTransaction) => {
    mutate(transaction);
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <BaseTransactionModal
        title="Copy Transaction"
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransactions={[initialTransaction]}
        ignoreInitialAmount={true}
        mode="create"
      />
    </Modal>
  );
}
