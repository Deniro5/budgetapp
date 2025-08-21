import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "appConstants";
import axios from "axios";
import { RawRecurringTransaction } from "types/Transaction";

type EditRecurringTransactionsProps = {
  recurringTransactionIds: string[];
  updatedFields: Partial<RawRecurringTransaction>;
};

export const useEditRecurringTransaction = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: ({
        recurringTransactionIds,
        updatedFields,
      }: EditRecurringTransactionsProps) =>
        axios
          .put(`${BASE_API_URL}/recurring-transactions`, {
            recurringTransactionIds,
            updatedFields,
          })
          .then((res) => res.data), // Return updated transactions
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["recurringTransactions"] });
      },
    },
    customSuccess: "Recurring transactions updated successfully",
  });
};
