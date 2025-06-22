import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../../constants";
import { Asset } from "types/investment";

export const useAssetSearch = () => {
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 400);

    return () => clearTimeout(handler);
  }, [input]);

  const query = useQuery({
    queryKey: ["assetSearch", debouncedInput],
    queryFn: async () => {
      const res = await axios.get<Asset[]>(
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
