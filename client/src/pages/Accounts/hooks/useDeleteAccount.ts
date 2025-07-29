import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "../../../hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "../../../constants";
import axios from "axios";

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: (accountId: string) =>
        axios.delete(`${BASE_API_URL}/accounts/${accountId}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
      },
    },
    customSuccess: "Account deleted successfully",
  });
};
