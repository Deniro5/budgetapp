import { useEffect, useMemo } from "react";
import useTransactionStore from "../zustand/transaction/transactionStore";
import { TransactionFilter } from "../types/transaction";

type useTransactionProps = {
  search: string;
  filter: TransactionFilter;
};

export default function useTransaction({
  search,
  filter,
}: useTransactionProps) {
  const { isLoading, error, fetchTransactions, transactions } =
    useTransactionStore();

  const queryString = useMemo(() => {
    const res = [];

    if (search) res.push(`q=${search}`);

    Object.keys(filter).forEach((filterName) => {
      if (filter[filterName]) res.push(`${filterName}=${filter[filterName]}`);
    });

    return `?${res.join("&")}`;
  }, [search, filter]);

  useEffect(() => {
    fetchTransactions(queryString);
  }, [queryString]);

  return {
    transactions,
    isLoading,
    error,
  };
}
