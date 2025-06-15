import { useEffect, useState } from "react";
import useAccountStore from "store/account/accountStore";
import useBudgetStore from "store/budget/budgetStore";
import usePresetTransactionStore from "store/presetTransaction/presetTransactionStore";

const useInitialLoad = () => {
  const { fetchBudget } = useBudgetStore();
  const { fetchPresetTransactions } = usePresetTransactionStore();
  const { fetchAccountsWithBalance } = useAccountStore();

  //Other widgets

  useEffect(() => {
    const fetchData = async () => {
      await fetchBudget();
      await fetchPresetTransactions();
      await fetchAccountsWithBalance();
    };

    fetchData();
  }, []);
};

export default useInitialLoad;
