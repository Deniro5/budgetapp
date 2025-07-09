import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL } from "../../../constants";
import axios from "axios";

export const useDeletePresetTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string) =>
      axios.delete(`${BASE_API_URL}/preset-transactions/${transactionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preset-transactions"] });
    },
  });
};
