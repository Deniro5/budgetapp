import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "appConstants";
import axios from "axios";

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: (transactionId: string) =>
        axios
          .delete(`${BASE_API_URL}/transactions/${transactionId}`)
          .then((res) => res.data), // returning deleted transaction data
      onSuccess: (deletedTransaction) => {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({
          queryKey: ["account", deletedTransaction.accountId],
        });
      },
    },
    customSuccess: "Transaction deleted successfully",
  });
};
