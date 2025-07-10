import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL } from "../../../../constants";
import axios from "axios";
import { RawTransfer } from "types/Transaction";

type UpdateTransferProps = {
  transactionId: string;
  updatedTransfer: RawTransfer;
};

export const useUpdateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transactionId, updatedTransfer }: UpdateTransferProps) =>
      axios.put(
        `${BASE_API_URL}/transfers/update-by-transaction-id/${transactionId}`,
        updatedTransfer
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
