import { useEffect, useRef } from "react";
import useTransactionStore from "store/transaction/transactionStore";

export function useTableClickListener() {
  const { setSelectedTransactions, activeOverlay } = useTransactionStore();
  const tableRef = useRef<HTMLDivElement>(null);

  // Ref to always have the latest activeOverlay
  const overlayRef = useRef(activeOverlay);
  useEffect(() => {
    overlayRef.current = activeOverlay;
  }, [activeOverlay]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node) &&
        !overlayRef.current
      ) {
        setSelectedTransactions([]);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);

      // Use the ref to get latest value in cleanup
      if (!overlayRef.current) {
        setSelectedTransactions([]);
      }
    };
  }, [setSelectedTransactions]); // no need for activeOverlay in deps

  return tableRef;
}
