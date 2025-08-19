import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  QueryFunctionContext,
} from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { ToastContext } from "../context/Toast";

export function useInfiniteQueryWithError<
  TQueryKey extends readonly unknown[],
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TPageParam = unknown
>(
  queryKey: TQueryKey,
  queryFn: (
    context: QueryFunctionContext<TQueryKey, TPageParam>
  ) => Promise<TQueryFnData>,
  options: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>,
    "queryKey" | "queryFn"
  >,
  customError?: string
): UseInfiniteQueryResult<TData, TError> {
  const { setToast } = useContext(ToastContext);

  const queryResult = useInfiniteQuery({
    queryKey,
    queryFn,
    ...options,
    retry: false,
  });

  useEffect(() => {
    if (queryResult.error) {
      setToast({
        type: "error",
        toast:
          customError ||
          queryResult.error.toString() ||
          "Something went wrong.",
      });
    }
  }, [queryResult.error]);

  return queryResult;
}
