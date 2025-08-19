import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { RecurringTransaction, TransactionFilter } from "types/Transaction";
import { BASE_API_URL } from "appConstants";
import { useInfiniteQueryWithError } from "hooks/useInfiniteQueryWithError";

type FetchRecurringTransactionsArgs = {
  search: string;
  filter: TransactionFilter;
  startDate: string;
  endDate: string;
};

type FetchRecurringTransactionsResponse = {
  recurringTransactions: RecurringTransaction[];
  recurringTransactionCount: number;
};

// Fetcher function
const fetchRecurringTransactions = async (
  context: QueryFunctionContext<
    [string, FetchRecurringTransactionsArgs],
    number
  >
): Promise<FetchRecurringTransactionsResponse> => {
  const { pageParam = 0, queryKey } = context;
  const [_key, { search, filter, startDate, endDate }] = queryKey;

  const params = new URLSearchParams();
  params.append("offset", pageParam.toString());
  if (search) params.append("q", search);
  params.append("startDate", startDate);
  params.append("endDate", endDate);

  Object.entries(filter).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value) {
      params.append(key, value.toString());
    }
  });

  const response = await axios.get<FetchRecurringTransactionsResponse>(
    `${BASE_API_URL}/recurring-transactions?${params.toString()}`
  );

  return response.data;
};

// Hook
export default function useRecurringTransactions({
  search,
  filter,
  startDate,
  endDate,
}: FetchRecurringTransactionsArgs) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQueryWithError<
    [string, FetchRecurringTransactionsArgs],
    FetchRecurringTransactionsResponse,
    Error,
    import("@tanstack/react-query").InfiniteData<
      FetchRecurringTransactionsResponse,
      number
    >,
    number
  >(
    ["recurringTransactions", { search, filter, startDate, endDate }],
    fetchRecurringTransactions,
    {
      getNextPageParam: (lastPage, allPages) => {
        const loaded = allPages.reduce(
          (sum, page) => sum + page.recurringTransactions.length,
          0
        );
        return loaded < lastPage.recurringTransactionCount ? loaded : undefined;
      },
      initialPageParam: 0,
    },
    "Failed to load recurring transactions"
  );

  const recurringTransactions =
    data?.pages.flatMap((p) => p.recurringTransactions) ?? [];
  const recurringTransactionCount =
    data?.pages[0]?.recurringTransactionCount ?? 0;

  return {
    recurringTransactions,
    recurringTransactionCount,
    isLoading,
    isFetchingNextPage,
    error,
    loadMore: fetchNextPage,
    hasMore: hasNextPage,
  };
}
