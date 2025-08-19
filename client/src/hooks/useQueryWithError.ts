import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { ToastContext } from "../context/Toast";
import { useContext, useEffect } from "react";

export function useQueryWithError<TData, TError, TQueryFnData = TData>(
  queryKey: UseQueryOptions<TQueryFnData, TError, TData>["queryKey"],
  queryFn: UseQueryOptions<TQueryFnData, TError, TData>["queryFn"],
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData>,
    "queryKey" | "queryFn"
  >,
  customError?: string
): UseQueryResult<TData, TError> {
  const { setToast } = useContext(ToastContext);

  const queryResult = useQuery<TQueryFnData, TError, TData>({
    queryKey,
    queryFn,
    ...options,
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
