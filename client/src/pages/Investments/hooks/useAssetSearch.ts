import { useQueryWithError } from "../../../hooks/useQueryWithError";
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

  const { data, isLoading, error } = useQueryWithError<Asset[], Error>(
    ["assetSearch", debouncedInput],
    async () => {
      const res = await axios.get<Asset[]>(
        `${BASE_API_URL}/investments/search`,
        { params: { q: debouncedInput } }
      );
      return res.data;
    },
    {
      enabled: !!debouncedInput,
      staleTime: 5 * 60 * 1000,
    },
    "Failed to search for assets"
  );

  return {
    input,
    setInput,
    results: data ?? [],
    isLoading,
    error,
  };
};
