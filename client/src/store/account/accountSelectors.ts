import useAccountStore from "./accountStore";
import { AccountStore } from "./accountStore";

export const getAccountById = (id: string) =>
  useAccountStore((state: AccountStore) => {
    if (!state.accounts.length) return undefined;

    const account = state.accounts.find((account) => account._id === id);
    return account;
  });

export const getAccountNameByIdMap = () =>
  useAccountStore((state: AccountStore) => {
    return state.accounts.reduce((acc: Record<string, string>, cur) => {
      acc[cur._id] = cur.name;
      return acc;
    }, {});
  });

export const getAccountids = () =>
  useAccountStore((state: AccountStore) =>
    state.accounts.map((account) => account._id)
  );
