import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "../../../hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "../../../constants";
import axios from "axios";
import { RawAccount } from "types/account";

export const useAddAccount = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: (newAccount: RawAccount) =>
        axios.post(`${BASE_API_URL}/accounts`, newAccount),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
      },
    },
    customSuccess: "Account created successfully",
  });
};
