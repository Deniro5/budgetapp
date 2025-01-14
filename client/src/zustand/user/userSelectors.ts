import { TRANSACTION_CATEGORIES } from "../../components/Transactions/constants";
import useUserStore from "./userStore";
import { UserStore } from "./userStore";

export const getUserPreferences = () =>
  useUserStore((state: UserStore) => state.user?.preferences);

export const getUserTransactionCategories = () =>
  useUserStore((state: UserStore) =>
    TRANSACTION_CATEGORIES.filter(
      (category) =>
        !state.user?.preferences.disabledCategories.includes(category)
    )
  );
