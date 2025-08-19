import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "appConstants";
import axios from "axios";
import { RawTransfer } from "types/Transaction";

type UpdateTransferProps = {
  transactionId: string;
  updatedTransfer: RawTransfer;
};

export const useUpdateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: ({ transactionId, updatedTransfer }: UpdateTransferProps) =>
        axios.put(
          `${BASE_API_URL}/transfers/update-by-transaction-id/${transactionId}`,
          updatedTransfer
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      },
    },
    customSuccess: "Transfer updated successfully",
  });
};
