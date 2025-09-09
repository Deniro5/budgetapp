import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "appConstants";
import axios from "axios";
import { RawPresetTransaction } from "types/Transaction";

type EditPresetTransactionsProps = {
  presetTransactionIds: string[];
  updatedFields: Partial<RawPresetTransaction>;
};

export const useEditPresetTransaction = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: ({
        presetTransactionIds,
        updatedFields,
      }: EditPresetTransactionsProps) =>
        axios
          .put(`${BASE_API_URL}/preset-transactions`, {
            presetTransactionIds,
            updatedFields,
          })
          .then((res) => res.data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["presetTransactions"] });
      },
    },
    customSuccess: "Preset transactions updated successfully",
  });
};
