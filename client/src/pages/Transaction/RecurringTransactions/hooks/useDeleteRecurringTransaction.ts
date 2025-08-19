import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "appConstants";
import axios from "axios";

export const useDeleteRecurringTransaction = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: (transactionId: string) =>
        axios.delete(`${BASE_API_URL}/recurring-transactions/${transactionId}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["recurringTransactions"] });
      },
    },
    customSuccess: "Recurring transaction deleted successfully",
  });
};
