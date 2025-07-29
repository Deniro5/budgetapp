import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "../../../../hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "../../../../constants";
import axios from "axios";
import { RawTransaction } from "types/Transaction";

type UpdateTransactionProps = {
  transactionId: string;
  updatedTransaction: RawTransaction;
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: ({
        transactionId,
        updatedTransaction,
      }: UpdateTransactionProps) =>
        axios
          .put(
            `${BASE_API_URL}/transactions/${transactionId}`,
            updatedTransaction
          )
          .then((res) => res.data), // Return only the updated transaction
      onSuccess: (updatedTransaction) => {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({
          queryKey: ["account", updatedTransaction.accountId],
        });
      },
    },
    customSuccess: "Transaction updated successfully",
  });
};
