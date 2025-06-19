import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../../constants";
import { InvestmentSearchResult } from "types/investment";

export const useInvestmentSearch = () => {
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 400);

    return () => clearTimeout(handler);
  }, [input]);

  const query = useQuery({
    queryKey: ["investmentSearch", debouncedInput],
    queryFn: async () => {
      const res = await axios.get<InvestmentSearchResult[]>(
        `${BASE_API_URL}/investments/search`,
        {
          params: { q: debouncedInput },
        }
      );
      return res.data;
    },
    enabled: !!debouncedInput,
    staleTime: 5 * 60 * 1000,
  });

  return {
    input,
    setInput,
    results: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
};
