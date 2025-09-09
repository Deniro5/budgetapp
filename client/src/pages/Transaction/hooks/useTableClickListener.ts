import { useEffect, useRef } from "react";
import useTransactionStore from "store/transaction/transactionStore";

export function useTableClickListener() {
  const { setSelectedTransactions, activeOverlay } = useTransactionStore();
  const tableRef = useRef<HTMLDivElement>(null);

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
      if (!overlayRef.current) {
        setSelectedTransactions([]);
      }
    };
  }, [setSelectedTransactions]);

  return tableRef;
}
