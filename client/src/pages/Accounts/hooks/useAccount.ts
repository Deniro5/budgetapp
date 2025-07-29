import { useQueryWithError } from "../../../hooks/useQueryWithError";
import axios from "axios";
import { BASE_API_URL } from "../../../constants";
import { Account } from "types/account";

// Hook
export default function useAccount(accountId: string | undefined) {
  const { data, isLoading, error } = useQueryWithError<Account, Error>(
    ["account", accountId],
    async () => {
      const res = await axios.get<Account>(
        `${BASE_API_URL}/accounts/${accountId}`
      );
      return res.data;
    },
    {
      enabled: !!accountId,
    },
    "Failed to load account"
  );

  return {
    account: data,
    isLoading,
    error,
  };
}
