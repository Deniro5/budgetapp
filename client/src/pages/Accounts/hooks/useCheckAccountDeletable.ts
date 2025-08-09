import { useQueryWithError } from "../../../hooks/useQueryWithError";
import axios from "axios";
import { BASE_API_URL } from "../../../constants";

type useCheckAccountDeletableProps = {
  accountId: string;
};

type AccountWithBalances = {
  date: string;
  balance: number;
  value: number;
}[];

const fetchAccountWithBalances = async (
  accountId: string
): Promise<AccountWithBalances> => {
  const startDate = new Date().toISOString().split("T")[0];
  const endDate = new Date().toISOString().split("T")[0];
  const queryString = `startDate=${startDate}&endDate=${endDate}`;
  const response = await axios.get<AccountWithBalances>(
    `${BASE_API_URL}/accounts/account-with-balances/${accountId}/?${queryString}`
  );
  return response.data;
};

export const useCheckAccountDeletable = ({
  accountId,
}: useCheckAccountDeletableProps) => {
  const { data, isLoading, error } = useQueryWithError<
    AccountWithBalances,
    Error
  >(
    ["accountWithBalances", accountId],
    () => fetchAccountWithBalances(accountId),
    {
      enabled: !!accountId,
    },
    "Failed to load account balance data"
  );

  const isBalanceZero = isLoading
    ? false
    : data?.length
    ? data[data.length - 1].balance === 0
    : false;

  const isInvestmentZero = isLoading
    ? false
    : data?.length
    ? data[data.length - 1].value === 0
    : false;

  return {
    isInvestmentZero,
    isBalanceZero,
    isLoading,
    error,
  };
};
