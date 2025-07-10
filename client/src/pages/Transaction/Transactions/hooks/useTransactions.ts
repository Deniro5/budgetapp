import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { Transaction, TransactionFilter } from "types/Transaction";
import { BASE_API_URL } from "../../../../constants";

type FetchTransactionsArgs = {
  search: string;
  filter: TransactionFilter;
  startDate: string;
  endDate: string;
};

type FetchTransactionsResponse = {
  transactions: Transaction[];
  transactionCount: number;
};

const fetchTransactions = async (
  context: QueryFunctionContext<[string, FetchTransactionsArgs], number>
): Promise<FetchTransactionsResponse> => {
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

  const response = await axios.get<FetchTransactionsResponse>(
    `${BASE_API_URL}/transactions?${params.toString()}`
  );

  return response.data;
};

export default function useTransactions({
  search,
  filter,
  startDate,
  endDate,
}: FetchTransactionsArgs) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    FetchTransactionsResponse,
    Error,
    import("@tanstack/react-query").InfiniteData<
      FetchTransactionsResponse,
      number
    >, // TData
    [string, FetchTransactionsArgs], // TQueryKey
    number // TPageParam
  >({
    queryKey: ["transactions", { search, filter, startDate, endDate }],
    queryFn: fetchTransactions,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce(
        (sum, page) => sum + page.transactions.length,
        0
      );
      return loaded < lastPage.transactionCount ? loaded : undefined;
    },
    initialPageParam: 0,
  });

  const transactions = data?.pages.flatMap((p) => p.transactions) ?? [];
  const transactionCount = data?.pages[0]?.transactionCount ?? 0;

  return {
    transactions,
    transactionCount,
    isLoading,
    isFetchingNextPage,
    error,
    loadMore: fetchNextPage,
    hasMore: hasNextPage,
  };
}
