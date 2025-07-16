import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL } from "../../../constants";
import axios from "axios";
import { RawAccount } from "types/account";

type EditAccountProps = {
  accountId: string;
  updatedAccount: RawAccount;
};

export const useEditAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountId, updatedAccount }: EditAccountProps) =>
      axios.put(`${BASE_API_URL}/accounts/${accountId}`, updatedAccount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};
