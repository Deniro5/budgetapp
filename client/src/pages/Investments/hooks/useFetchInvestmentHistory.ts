import { useQueryWithError } from "../../../hooks/useQueryWithError";
import axios from "axios";
import { BASE_API_URL } from "../../../constants";
import { Investment } from "../../../types/investment";

export const useFetchInvestmentHistory = () => {
  const { data, isLoading, error } = useQueryWithError<Investment[], Error>(
    ["investmentHistory"],
    async () => {
      const res = await axios.get<Investment[]>(
        `${BASE_API_URL}/investments/history`
      );
      return res.data;
    },
    {
      enabled: true,
    },
    "Failed to fetch investment history"
  );

  return {
    results: data ?? [],
    isLoading,
    error,
  };
};
