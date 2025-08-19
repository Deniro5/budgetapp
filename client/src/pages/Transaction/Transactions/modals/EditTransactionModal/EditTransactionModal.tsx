import Modal from "components/Global/Modal";
import { BaseTransactionModal } from "../BaseTransactionModal/BaseTransactionModal";
import {
  BatchEditTransaction,
  RawTransaction,
  Transaction,
} from "types/Transaction";
import { useUpdateTransaction } from "../../hooks/useUpdateTransaction";
import useTransactionStore from "store/transaction/transactionStore";
import { useState } from "react";

type EditTransactionModalProps = {
  transaction: Transaction;
  onClose: () => void;
};

export function EditTransactionModal({
  transaction,
  onClose,
}: EditTransactionModalProps) {
  const { mutate } = useUpdateTransaction();
  const { selectedTransactions } = useTransactionStore();
  const areMultipleSelected = selectedTransactions.length > 1;

  const [initialTransactions, setInitialTransactions] =
    useState<Transaction[]>(selectedTransactions);

  const handleModalSubmit = (updatedTransaction: BatchEditTransaction) => {
    console.log(updatedTransaction);
    mutate({ transactionId: transaction._id, updatedTransaction });
  };

  return (
    <Modal isOpen={true} onClose={onClose} width={700}>
      <BaseTransactionModal
        title={`Edit Transaction${areMultipleSelected ? "s" : ""}`}
        onClose={onClose}
        onSubmit={handleModalSubmit}
        initialTransactions={initialTransactions}
        confirmText="Update"
        isEditModal
      />
    </Modal>
  );
}
