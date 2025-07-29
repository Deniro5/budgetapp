import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "../../../../hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "../../../../constants";
import axios from "axios";
import { RawPresetTransaction } from "types/Transaction";

export const useAddPresetTransaction = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: (newPresetTransaction: RawPresetTransaction) =>
        axios.post(`${BASE_API_URL}/preset-transactions`, newPresetTransaction),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["presetTransactions"] });
      },
    },
    customSuccess: "Preset transaction added successfully",
  });
};
