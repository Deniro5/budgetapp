import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { PresetTransaction } from "types/Transaction";
import { BASE_API_URL } from "../../../../constants";

type FetchPresetTransactionsArgs = {
  search: string;
};

type FetchPresetTransactionsResponse = {
  presetTransactions: PresetTransaction[];
  presetTransactionCount: number;
};

// Fetcher function
const fetchPresetTransactions = async (
  context: QueryFunctionContext<[string, FetchPresetTransactionsArgs], number>
): Promise<FetchPresetTransactionsResponse> => {
  const { pageParam = 0, queryKey } = context;
  const [_key, { search }] = queryKey;

  if (search === "")
    return { presetTransactions: [], presetTransactionCount: 0 };

  const params = new URLSearchParams();
  params.append("offset", pageParam.toString());
  if (search) params.append("q", search);

  const response = await axios.get<FetchPresetTransactionsResponse>(
    `${BASE_API_URL}/preset-transactions?${params.toString()}&limit=5`
  );

  return response.data;
};

// Hook
export default function usePresetTransactionSearch({
  search,
}: FetchPresetTransactionsArgs) {
  const { data, isLoading, error } = useInfiniteQuery<
    FetchPresetTransactionsResponse,
    Error,
    import("@tanstack/react-query").InfiniteData<
      FetchPresetTransactionsResponse,
      number
    >,
    [string, FetchPresetTransactionsArgs],
    number
  >({
    queryKey: ["presetTransactionList", { search }],
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

  return {
    presetTransactions,
    isLoading,
    error,
  };
}
