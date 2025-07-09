import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL } from "../../../constants";
import axios from "axios";
import { RawPresetTransaction } from "types/Transaction";

type UpdatePresetTransactionProps = {
  presetTransactionId: string;
  updatedPresetTransaction: RawPresetTransaction;
};

export const useUpdatePresetTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      presetTransactionId,
      updatedPresetTransaction,
    }: UpdatePresetTransactionProps) =>
      axios.put(
        `${BASE_API_URL}/transactions/${presetTransactionId}`,
        updatedPresetTransaction
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
