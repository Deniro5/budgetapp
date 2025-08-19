export enum TransactionOverlayType {
  ADD = "add",
  EDIT = "edit",
  DELETE = "delete",
  CONTEXT = "context",
  COPY = "copy",
  ADD_TRANSFER = "addTransfer",
  COPY_TRANSFER = "copyTransfer",
  DELETE_TRANSFER = "deleteTransfer",
  EDIT_TRANSFER = "editTransfer",
  ADD_PRESET = "addPreset",
  COPY_PRESET = "copyPreset",
  DELETE_PRESET = "deletePreset",
  EDIT_PRESET = "editPreset",
  ADD_RECURRING = "addRecurring",
  COPY_RECURRING = "copyRecurring",
  DELETE_RECURRING = "deleteRecurring",
  EDIT_RECURRING = "editRecurring",
}

export type View = "Transactions" | "Preset" | "Recurring";
