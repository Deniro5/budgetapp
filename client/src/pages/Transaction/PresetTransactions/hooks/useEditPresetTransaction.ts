import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "../../../../hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "../../../../constants";
import axios from "axios";
import { RawPresetTransaction } from "types/Transaction";

type EditPresetTransactionProps = {
  presetTransactionId: string;
  updatedPresetTransaction: RawPresetTransaction;
};

export const useEditPresetTransaction = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: ({
        presetTransactionId,
        updatedPresetTransaction,
      }: EditPresetTransactionProps) =>
        axios.put(
          `${BASE_API_URL}/preset-transactions/${presetTransactionId}`,
          updatedPresetTransaction
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["presetTransactions"] });
      },
    },
    customSuccess: "Preset transaction updated successfully",
  });
};
