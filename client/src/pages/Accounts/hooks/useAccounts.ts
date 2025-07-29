import { useQueryWithError } from "../../../hooks/useQueryWithError";
import axios from "axios";
import { BASE_API_URL } from "../../../constants";
import { Account } from "types/account";

// Hook
export default function useAccounts() {
  const { data, isLoading, error } = useQueryWithError<Account[], Error>(
    ["accounts"],
    async () => {
      const res = await axios.get<Account[]>(
        `${BASE_API_URL}/accounts?includeBalance=true`
      );
      return res.data;
    },
    {
      enabled: true,
    },
    "Failed to load accounts"
  );

  return {
    accounts: data ?? [],
    isLoading,
    error,
  };
}
