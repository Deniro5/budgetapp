import { useQueryWithError } from "hooks/useQueryWithError";
import axios from "axios";
import { BASE_API_URL } from "appConstants";

type useAccountWidgetProps = {
  startDate: string;
  endDate: string;
  accountWidgetId: string;
};

type AccountWithBalances = {
  date: string;
  balance: number;
  value: number;
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
  const { data, isLoading, error } = useQueryWithError<
    AccountWithBalances,
    Error
  >(
    ["accountWithBalances", accountWidgetId, startDate, endDate],
    () => fetchAccountWithBalances(accountWidgetId, startDate, endDate),
    {
      enabled: !!accountWidgetId && !!startDate && !!endDate,
    },
    "Failed to load account balance data"
  );

  return {
    accountWithBalances: data ?? [],
    isLoading,
    error,
  };
};
