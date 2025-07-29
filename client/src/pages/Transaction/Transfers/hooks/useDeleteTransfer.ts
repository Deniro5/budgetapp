import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "../../../../hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "../../../../constants";
import axios from "axios";

export const useDeleteTransfer = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: (transactionId: string) =>
        axios.delete(
          `${BASE_API_URL}/transfers/delete-by-transaction-id/${transactionId}`
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      },
    },
    customSuccess: "Transfer deleted successfully",
  });
};
