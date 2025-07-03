import { useEffect, useMemo, useState } from "react";

import { TransactionFilter } from "types/Transaction";

import usePresetTransactionStore from "store/presetTransaction/presetTransactionStore";

type usePresetTransactionProps = {
  search: string;
  filter: TransactionFilter;
  startDate: string;
  endDate: string;
};

export default function usePresetTransactions({
  search,
  filter,
  startDate,
  endDate,
}: usePresetTransactionProps) {
  const {
    isLoading,
    error,
    fetchPresetTransactions,
    presetTransactions,
    presetTransactionCount,
  } = usePresetTransactionStore();

  const [page, setPage] = useState(0);

  const hasMore = presetTransactions.length < presetTransactionCount;
  const isInitialLoad = page === 0;

  const loadMore = () => {
    if (!hasMore || presetTransactions.length === 0) return;
    setPage(page + 1);
  };

  const queryString = useMemo(() => {
    const res = [];
    res.push(`offset=${isInitialLoad ? 0 : presetTransactions.length}`);
    if (search) res.push(`q=${encodeURIComponent(search)}`);

    res.push(`startDate=${startDate}&endDate=${endDate}`);

    Object.keys(filter).forEach((filterName) => {
      const key = filterName as keyof TransactionFilter;

      if (filter[key]) {
        const value = filter[key];
        if (Array.isArray(value)) {
          // Handle arrays by appending each value separately
          value.forEach((item) => {
            res.push(`${filterName}=${encodeURIComponent(item)}`);
          });
        } else {
          // Handle non-array values
          res.push(`${filterName}=${encodeURIComponent(value)}`);
        }
      }
    });

    return `?${res.join("&")}`;
  }, [search, filter, startDate, endDate, page]);

  //restart lazy loading when a new filter is applied
  useEffect(() => {
    setPage(0);
  }, [search, filter, startDate, endDate]);

  //handle loading
  useEffect(() => {
    fetchPresetTransactions(queryString, isInitialLoad);
  }, [queryString]);

  return {
    presetTransactions,
    presetTransactionCount,
    loadMore,
    isLoading,
    error,
  };
}
