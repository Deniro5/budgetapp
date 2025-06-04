import { useEffect } from "react";
import useAccountStore from "store/account/accountStore";

export default function useAccount() {
  const { isLoading, error, fetchAccounts } = useAccountStore();

  useEffect(() => {
    fetchAccounts();
  }, []);
}
