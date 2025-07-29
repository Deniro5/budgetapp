import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "../../../../hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "../../../../constants";
import axios from "axios";

export const useDeletePresetTransaction = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: (transactionId: string) =>
        axios.delete(`${BASE_API_URL}/preset-transactions/${transactionId}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["presetTransactions"] });
      },
    },
    customSuccess: "Preset transaction deleted successfully",
  });
};
