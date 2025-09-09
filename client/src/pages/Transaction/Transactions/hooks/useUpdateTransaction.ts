import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "appConstants";
import axios from "axios";
import { RawTransaction } from "types/Transaction";

type UpdateTransactionProps = {
  transactionIds: string[];
  updatedFields: Partial<RawTransaction>;
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: ({ transactionIds, updatedFields }: UpdateTransactionProps) =>
        axios
          .put(`${BASE_API_URL}/transactions`, {
            updatedFields,
            transactionIds,
          })
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
