import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "../../../../hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "../../../../constants";
import axios from "axios";
import { RawTransaction } from "types/Transaction";

export const useAddTransaction = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: (newTransaction: RawTransaction) =>
        axios
          .post(`${BASE_API_URL}/transactions`, newTransaction)
          .then((res) => res.data),
      onSuccess: (newTransaction) => {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({
          queryKey: ["account", newTransaction.accountId],
        });
      },
    },
    customSuccess: "Transaction added successfully",
  });
};
