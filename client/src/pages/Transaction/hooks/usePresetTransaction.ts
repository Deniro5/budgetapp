import { useEffect } from "react";
import usePresetTransactionStore from "store/presetTransaction/presetTransactionStore";

export default function useTransaction() {
  const { isLoading, error, hasLoaded, fetchPresetTransactions } =
    usePresetTransactionStore();

  useEffect(() => {
    if (hasLoaded) return;

    fetchPresetTransactions();
  }, [hasLoaded]);

  //on error, toast
}
