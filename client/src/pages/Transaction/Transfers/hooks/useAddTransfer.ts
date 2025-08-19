import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "appConstants";
import axios from "axios";
import { RawTransfer } from "types/Transaction";

export const useAddTransfer = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: (newTransfer: RawTransfer) =>
        axios.post(`${BASE_API_URL}/transfers`, newTransfer),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      },
    },
    customSuccess: "Transfer added successfully",
  });
};
