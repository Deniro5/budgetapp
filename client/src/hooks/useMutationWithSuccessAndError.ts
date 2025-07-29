import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useContext } from "react";
import { ToastContext } from "../Context/Toast";

export function useMutationWithSuccessAndError<TData, TError, TVariables>({
  options,
  customError,
  customSuccess,
}: {
  options: UseMutationOptions<TData, TError, TVariables>;
  customError?: string;
  customSuccess?: string;
}) {
  const { setToast } = useContext(ToastContext);

  return useMutation<TData, TError, TVariables>({
    ...options,
    onSuccess: (data, variables, context) => {
      setToast({
        type: "success",
        toast: customSuccess || "Operation completed successfully",
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      setToast({
        type: "error",
        toast: customError || "Something went wrong. Please try again",
      });
      options?.onError?.(error, variables, context);
    },
  });
}
