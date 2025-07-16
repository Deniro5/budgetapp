import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL } from "../../../constants";
import axios from "axios";
import { RawAccount } from "types/account";

export const useAddAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newAccount: RawAccount) =>
      axios.post(`${BASE_API_URL}/accounts`, newAccount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};
