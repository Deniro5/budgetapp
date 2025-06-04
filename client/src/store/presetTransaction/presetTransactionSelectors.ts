import useTransactionStore from "./presetTransactionStore";
import { PresetTransactionStore } from "./presetTransactionStore";

export const getPresetTransactions = () =>
  useTransactionStore(
    (state: PresetTransactionStore) => state.presetTransactions
  );

export const getPresetTransactionNames = () =>
  useTransactionStore((state: PresetTransactionStore) =>
    state.presetTransactions.map((presetTransaction) => presetTransaction.name)
  );
