import { PresetTransaction, Transaction } from "types/Transaction";

export function isPresetTransaction(
  tx: Transaction | PresetTransaction | null
): tx is PresetTransaction {
  if (!tx) return false;

  return "name" in tx;
}

export function isTransaction(
  tx: Transaction | PresetTransaction | null
): tx is Transaction {
  if (!tx) return false;

  return !("name" in tx);
}
