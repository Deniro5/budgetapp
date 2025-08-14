import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "../../../../hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "../../../../constants";
import axios from "axios";
import { RawRecurringTransaction } from "types/Transaction";

export const useAddRecurringTransaction = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: (newRecurringTransaction: RawRecurringTransaction) =>
        axios.post(
          `${BASE_API_URL}/recurring-transactions`,
          newRecurringTransaction
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["recurringTransactions"] });
      },
    },
    customSuccess: "Recurring transaction added successfully",
  });
};
