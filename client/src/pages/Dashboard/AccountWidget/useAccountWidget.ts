import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_API_URL } from "../../../constants";

type useAccountWidgetProps = {
  startDate: string;
  endDate: string;
  accountWidgetId: string;
};

type AccountWithBalances = {
  date: string;
  balance: number;
}[];

const fetchAccountWithBalances = async (
  accountWidgetId: string,
  startDate: string,
  endDate: string
): Promise<AccountWithBalances> => {
  const queryString = `startDate=${startDate}&endDate=${endDate}`;
  const response = await axios.get<AccountWithBalances>(
    `${BASE_API_URL}/accounts/account-with-balances/${accountWidgetId}/?${queryString}`
  );
  return response.data;
};

export const useAccountWidget = ({
  startDate,
  endDate,
  accountWidgetId,
}: useAccountWidgetProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["accountWithBalances", accountWidgetId, startDate, endDate],
    queryFn: () =>
      fetchAccountWithBalances(accountWidgetId, startDate, endDate),
    enabled: !!accountWidgetId && !!startDate && !!endDate,
  });

  return {
    accountWithBalances: data ?? [],
    isLoading,
    error,
  };
};
