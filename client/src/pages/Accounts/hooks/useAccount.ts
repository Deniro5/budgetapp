import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_API_URL } from "../../../constants";
import { Account } from "types/account";

// Hook
export default function useAccount(accountId: string | undefined) {
  const { data, isLoading, error } = useQuery<Account>({
    queryKey: ["account", accountId],
    queryFn: async () => {
      const res = await axios.get<Account>(
        `${BASE_API_URL}/accounts/${accountId}`
      );
      return res.data;
    },
    enabled: !!accountId, // only fetch if accountId is truthy
  });

  return {
    account: data,
    isLoading,
    error,
  };
}
