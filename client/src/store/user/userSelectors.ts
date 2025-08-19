import { transactionOnlyCategories } from "types/Transaction";
import { UserStore } from "./userStore";
import useUserStore from "./userStore";

export const getUserPreferences = () =>
  useUserStore((state: UserStore) => state.user?.preferences);

export const getUserTransactionCategories = () =>
  useUserStore((state: UserStore) =>
    Object.values(transactionOnlyCategories).filter(
      (category) =>
        !state.user?.preferences.disabledCategories.includes(category)
    )
  );
