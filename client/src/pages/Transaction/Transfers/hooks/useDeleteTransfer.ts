import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL } from "../../../../constants";
import axios from "axios";

export const useDeleteTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string) =>
      axios.delete(
        `${BASE_API_URL}/transfers/delete-by-transaction-id/${transactionId}`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
