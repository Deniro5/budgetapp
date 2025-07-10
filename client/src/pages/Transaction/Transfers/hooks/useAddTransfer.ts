import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL } from "../../../../constants";
import axios from "axios";
import { RawTransfer } from "types/Transaction";

export const useAddTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTransfer: RawTransfer) =>
      axios.post(`${BASE_API_URL}/transfers`, newTransfer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
