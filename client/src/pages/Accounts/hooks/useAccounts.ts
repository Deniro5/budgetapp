import { useQueryWithError } from "../../../hooks/useQueryWithError";
import axios from "axios";
import { BASE_API_URL } from "../../../constants";
import { Account } from "types/account";
import { useMemo } from "react";

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

  const accountNameByIdMap =
    data?.reduce((acc: Record<string, string>, cur) => {
      acc[cur._id] = cur.name;
      return acc;
    }, {}) || {};

  //we are using useMemo here because these are used as dependencies in BaseInvestmentModal
  const activeAccounts = useMemo(
    () => data?.filter((account) => !account.isArchived) ?? [],
    [data]
  );

  const activeAccountIds = useMemo(
    () => activeAccounts?.map((account) => account._id) ?? [],
    [activeAccounts]
  );

  return {
    accounts: data ?? [],
    activeAccounts,
    activeAccountIds,
    accountNameByIdMap,
    isLoading,
    error,
  };
}
