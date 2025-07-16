import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_API_URL } from "../../../constants";

import { Account } from "types/account";

// Hook
export default function useAccounts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await axios.get<Account[]>(
        `${BASE_API_URL}/accounts?includeBalance=true`
      );
      return res.data;
    },
    enabled: true,
  });

  return {
    accounts: data ?? [],
    isLoading,
    error,
  };
}
