import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { Transaction, TransactionFilter } from "types/Transaction";
import { BASE_API_URL } from "../../../../constants";

type FetchPresetTransactionsArgs = {
  search: string;
  filter: TransactionFilter;
  startDate: string;
  endDate: string;
};

type FetchPresetTransactionsResponse = {
  presetTransactions: Transaction[];
  presetTransactionCount: number;
};

// Fetcher function
const fetchPresetTransactions = async (
  context: QueryFunctionContext<[string, FetchPresetTransactionsArgs], number>
): Promise<FetchPresetTransactionsResponse> => {
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

  const response = await axios.get<FetchPresetTransactionsResponse>(
    `${BASE_API_URL}/preset-transactions?${params.toString()}`
  );

  return response.data;
};

// Hook
export default function usePresetTransactions({
  search,
  filter,
  startDate,
  endDate,
}: FetchPresetTransactionsArgs) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    FetchPresetTransactionsResponse,
    Error,
    import("@tanstack/react-query").InfiniteData<
      FetchPresetTransactionsResponse,
      number
    >,
    [string, FetchPresetTransactionsArgs],
    number
  >({
    queryKey: ["presetTransactions", { search, filter, startDate, endDate }],
    queryFn: fetchPresetTransactions,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce(
        (sum, page) => sum + page.presetTransactions.length,
        0
      );
      return loaded < lastPage.presetTransactionCount ? loaded : undefined;
    },
    initialPageParam: 0,
  });

  const presetTransactions =
    data?.pages.flatMap((p) => p.presetTransactions) ?? [];
  const presetTransactionCount = data?.pages[0]?.presetTransactionCount ?? 0;

  return {
    presetTransactions,
    presetTransactionCount,
    isLoading,
    isFetchingNextPage,
    error,
    loadMore: fetchNextPage,
    hasMore: hasNextPage,
  };
}
