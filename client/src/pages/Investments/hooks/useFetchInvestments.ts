import { useQueryWithError } from "hooks/useQueryWithError";
import axios from "axios";
import { BASE_API_URL } from "appConstants";
import { Investment } from "types/investment";

export const useFetchInvestments = () => {
  const { data, isLoading, error } = useQueryWithError<Investment[], Error>(
    ["investments"],
    async () => {
      const res = await axios.get<Investment[]>(`${BASE_API_URL}/investments`);
      return res.data;
    },
    { enabled: true },
    "Failed to fetch investments"
  );

  const getCurrentInvestmentsQuantityMap = () =>
    data
      ? data.reduce((result, investment) => {
          result[investment.asset.symbol] = investment.quantity;
          return result;
        }, {} as Record<string, number>)
      : {};

  const getInvestmentsByAccount = () => {
    return data
      ? data.reduce((result, investment) => {
          const { entries } = investment;
          for (const entry of entries) {
            //initialize an empty entry for the account
            if (!result[entry.account]) {
              result[entry.account] = {};
            }
            //
            if (result[entry.account][entry.asset.symbol]) {
              result[entry.account][entry.asset.symbol] += entry.quantity;
            } else {
              result[entry.account][entry.asset.symbol] = entry.quantity;
            }
          }
          return result;
        }, {} as Record<string, Record<string, number>>)
      : {};
  };

  return {
    results: data ?? [],
    isLoading,
    error,
    getCurrentInvestmentsQuantityMap,
    getInvestmentsByAccount,
  };
};
