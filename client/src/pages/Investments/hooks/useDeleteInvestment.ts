import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "appConstants";
import axios from "axios";

export const useDeleteInvestment = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: (investmentId: string) =>
        axios.delete(`${BASE_API_URL}/investments/${investmentId}`),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["investments"] });
        await queryClient.invalidateQueries({
          queryKey: ["investmentHistory"],
        });
      },
    },
    customSuccess: "Operation completed successfully",
  });
};
