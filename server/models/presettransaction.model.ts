import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IPresetTransaction extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  name: string;
  userId: Types.ObjectId;
  description?: string;
  amount?: number;
  type?: string;
  date?: string;
  account?: Types.ObjectId;
  category?: string;
  vendor?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const presetTransactionSchema: Schema<IPresetTransaction> = new Schema(
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

const PresetTransactionModel: Model<IPresetTransaction> =
  mongoose.model<IPresetTransaction>(
    "PresetTransaction",
    presetTransactionSchema
  );

export default PresetTransactionModel;
