import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL } from "../../../constants";
import axios from "axios";
import { RawTransaction } from "types/Transaction";

type UpdateTransactionProps = {
  transactionId: string;
  updatedTransaction: RawTransaction;
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      updatedTransaction,
    }: UpdateTransactionProps) =>
      axios.put(
        `${BASE_API_URL}/transactions/${transactionId}`,
        updatedTransaction
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
