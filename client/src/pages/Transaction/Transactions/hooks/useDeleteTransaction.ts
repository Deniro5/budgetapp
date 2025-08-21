import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "appConstants";
import axios from "axios";

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: (transactionIds: string[]) =>
        axios
          .delete(`${BASE_API_URL}/transactions`, {
            data: transactionIds,
          })
          .then((res) => res.data),
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
