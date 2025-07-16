import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL } from "../../../../constants";
import axios from "axios";

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string) =>
      axios
        .delete(`${BASE_API_URL}/transactions/${transactionId}`)
        .then((res) => res.data), // Only return the deleted transaction data
    onSuccess: (deletedTransaction) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({
        queryKey: ["account", deletedTransaction.accountId],
      });
    },
  });
};
