import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "../../../../hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "../../../../constants";
import axios from "axios";
import { RawRecurringTransaction } from "types/Transaction";

type EditRecurringTransactionProps = {
  recurringTransactionId: string;
  updatedRecurringTransaction: RawRecurringTransaction;
};

export const useEditRecurringTransaction = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: ({
        recurringTransactionId,
        updatedRecurringTransaction,
      }: EditRecurringTransactionProps) =>
        axios.put(
          `${BASE_API_URL}/recurring-transactions/${recurringTransactionId}`,
          updatedRecurringTransaction
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["recurringTransactions"] });
      },
    },
    customSuccess: "Recurring transaction updated successfully",
  });
};
