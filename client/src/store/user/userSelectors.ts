import { TransactionCategory } from "types/Transaction";
import useUserStore from "./userStore";
import { UserStore } from "./userStore";

export const getUserPreferences = () =>
  useUserStore((state: UserStore) => state.user?.preferences);

export const getUserTransactionCategories = () =>
  useUserStore((state: UserStore) =>
    Object.values(TransactionCategory).filter(
      (category) =>
        !state.user?.preferences.disabledCategories.includes(category)
    )
  );
