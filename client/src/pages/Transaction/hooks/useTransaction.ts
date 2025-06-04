import { useEffect, useMemo, useState } from "react";
import useTransactionStore from "../../../store/transaction/transactionStore";
import { TransactionFilter } from "types/Transaction";

type useTransactionProps = {
  search: string;
  filter: TransactionFilter;
  startDate: string;
  endDate: string;
};

export default function useTransaction({
  search,
  filter,
  startDate,
  endDate,
}: useTransactionProps) {
  const {
    isLoading,
    error,
    fetchTransactions,
    transactions,
    transactionCount,
  } = useTransactionStore();

  const [page, setPage] = useState(0);

  const hasMore = transactions.length < transactionCount;
  const isInitialLoad = page === 0;

  const loadMore = () => {
    if (!hasMore || transactions.length === 0) return;
    setPage(page + 1);
  };

  const queryString = useMemo(() => {
    const res = [];
    res.push(`offset=${isInitialLoad ? 0 : transactions.length}`);
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
    fetchTransactions(queryString, isInitialLoad);
  }, [queryString]);

  return {
    transactions,
    transactionCount,
    loadMore,
    isLoading,
    error,
  };
}
