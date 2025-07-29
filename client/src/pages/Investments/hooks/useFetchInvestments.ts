import { useQueryWithError } from "../../../hooks/useQueryWithError";
import axios from "axios";
import { BASE_API_URL } from "../../../constants";
import { Investment } from "../../../types/investment";

export const useFetchInvestments = () => {
  const { data, isLoading, error } = useQueryWithError<Investment[], Error>(
    ["investments"],
    async () => {
      const res = await axios.get<Investment[]>(`${BASE_API_URL}/investments`);
      return res.data;
    },
    { enabled: true },
    "Failed to fetch investments"
  );

  const currentInvestmentsQuantityMap: Record<string, number> = {};
  data?.forEach((investment) => {
    currentInvestmentsQuantityMap[investment.asset.symbol] =
      investment.quantity;
  });

  return {
    results: data ?? [],
    isLoading,
    error,
    currentInvestmentsQuantityMap,
  };
};
