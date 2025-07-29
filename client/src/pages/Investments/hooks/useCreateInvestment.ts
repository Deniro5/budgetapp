import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "../../../hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "../../../constants";
import axios from "axios";
import { RawInvestment } from "types/investment";

export const useCreateInvestment = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: (newInvestment: RawInvestment) =>
        axios.post(`${BASE_API_URL}/investments`, newInvestment),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["investments"] });
      },
    },
    customSuccess: "Operation completed successfully",
  });
};
