import { useQueryClient } from "@tanstack/react-query";
import { useMutationWithSuccessAndError } from "../../../hooks/useMutationWithSuccessAndError";
import { BASE_API_URL } from "../../../constants";
import axios from "axios";
import { BudgetType } from "../../../types/budget";

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutationWithSuccessAndError({
    options: {
      mutationFn: (updatedBudget: BudgetType) =>
        axios
          .put(`${BASE_API_URL}/budget`, updatedBudget)
          .then((res) => res.data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["budget"],
        });
        queryClient.invalidateQueries({
          queryKey: ["categoryExpenseByDate"],
          exact: false,
        });
      },
    },
    customSuccess: "Budget updated successfully",
  });
};
