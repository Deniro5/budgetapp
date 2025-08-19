import { useEffect, useRef } from "react";
import useTransactionStore from "store/transaction/transactionStore";

export function useTableClickListener() {
  const { setSelectedTransactions } = useTransactionStore();
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node)
      ) {
        setSelectedTransactions([]);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      setSelectedTransactions([]);
    };
  }, []);

  return tableRef;
}
