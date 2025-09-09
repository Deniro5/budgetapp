import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { PresetTransaction, TransactionFilter } from "types/Transaction";
import { BASE_API_URL } from "appConstants";
import { useInfiniteQueryWithError } from "hooks/useInfiniteQueryWithError";

type FetchPresetTransactionsArgs = {
  search: string;
  filter: TransactionFilter;
  startDate: string;
  endDate: string;
};

type FetchPresetTransactionsResponse = {
  presetTransactions: PresetTransaction[];
  presetTransactionCount: number;
};

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
  } = useInfiniteQueryWithError<
    [string, FetchPresetTransactionsArgs],
    FetchPresetTransactionsResponse,
    Error,
    import("@tanstack/react-query").InfiniteData<
      FetchPresetTransactionsResponse,
      number
    >,
    number
  >(
    ["presetTransactions", { search, filter, startDate, endDate }],
    fetchPresetTransactions,
    {
      getNextPageParam: (lastPage, allPages) => {
        const loaded = allPages.reduce(
          (sum, page) => sum + page.presetTransactions.length,
          0
        );
        return loaded < lastPage.presetTransactionCount ? loaded : undefined;
      },
      initialPageParam: 0,
    },
    "Failed to load preset transactions"
  );

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
