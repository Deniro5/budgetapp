import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "../../../hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "../../../constants";
import axios from "axios";
import { RawAccount } from "types/account";

type EditAccountProps = {
  accountId: string;
  updatedAccount: RawAccount;
};

export const useEditAccount = (
  customSuccess = "Account updated successfully"
) => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: ({ accountId, updatedAccount }: EditAccountProps) =>
        axios.put(`${BASE_API_URL}/accounts/${accountId}`, updatedAccount),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
      },
    },
    customSuccess,
  });
};
