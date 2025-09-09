import mongoose, { Schema, Model } from "mongoose";

const presetTransactionSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: false },
    amount: { type: Number, required: false },
    type: { type: String, required: false },
    date: { type: String, required: false },
    account: { type: Schema.Types.ObjectId, ref: "Account", required: false },
    category: { type: String, required: false },
    vendor: { type: String, required: false },
    tags: { type: [String], required: false },
  },
  { timestamps: true }
);

const PresetTransactionModel = mongoose.model(
  "PresetTransaction",
  presetTransactionSchema
);

export default PresetTransactionModel;
