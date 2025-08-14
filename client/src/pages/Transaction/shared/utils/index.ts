import {
  PresetTransaction,
  RecurringTransaction,
  Transaction,
} from "types/Transaction";

export function isRecurringTransaction(
  tx: Transaction | PresetTransaction | RecurringTransaction | null
): tx is RecurringTransaction {
  if (!tx) return false;

  return "interval" in tx;
}

export function isPresetTransaction(
  tx: Transaction | PresetTransaction | RecurringTransaction | null
): tx is PresetTransaction {
  if (!tx) return false;

  return "name" in tx;
}

export function isTransaction(
  tx: Transaction | PresetTransaction | RecurringTransaction | null
): tx is Transaction {
  if (!tx) return false;

  return !("name" in tx);
}
