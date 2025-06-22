import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_API_URL } from "../../../constants";
import { Investment } from "../../../types/investment";

export const useFetchInvestments = () => {
  const query = useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      const res = await axios.get<Investment[]>(`${BASE_API_URL}/investments`);
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
