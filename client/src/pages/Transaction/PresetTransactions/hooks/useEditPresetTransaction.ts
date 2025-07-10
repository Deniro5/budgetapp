import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL } from "../../../../constants";
import axios from "axios";
import { RawPresetTransaction } from "types/Transaction";

type EditPresetTransactionProps = {
  presetTransactionId: string;
  updatedPresetTransaction: RawPresetTransaction;
};

export const useEditPresetTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
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
  });
};
