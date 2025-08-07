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

  const accountIds = data?.map((account) => account._id) ?? [];
  const accountNameByIdMap =
    data?.reduce((acc: Record<string, string>, cur) => {
      acc[cur._id] = cur.name;
      return acc;
    }, {}) || {};

  return {
    accounts: data ?? [],
    accountIds,
    accountNameByIdMap,
    isLoading,
    error,
  };
}
