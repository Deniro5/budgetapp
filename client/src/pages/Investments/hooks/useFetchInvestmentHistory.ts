import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_API_URL } from "../../../constants";
import { Investment } from "../../../types/investment";

export const useFetchInvestmentHistory = () => {
  const query = useQuery({
    queryKey: ["investmentHistory"],
    queryFn: async () => {
      const res = await axios.get<Investment[]>(
        `${BASE_API_URL}/investments/history`
      );
      return res.data;
    },
    enabled: true,
  });

  return {
    results: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
};
