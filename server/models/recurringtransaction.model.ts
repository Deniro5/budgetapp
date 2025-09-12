import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRecurringTransaction extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  amount: number;
  type: string;
  account: Types.ObjectId;
  category: string;
  userId: Types.ObjectId;
  vendor: string;
  tags?: string[];
  description?: string;
  date: string;
  interval: "daily" | "weekly" | "bi-weekly" | "semi-monthly" | "monthly";
  createdAt: Date;
  updatedAt: Date;
}

const recurringTransactionSchema: Schema<IRecurringTransaction> = new Schema(
  {
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    category: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vendor: { type: String, required: true },
    tags: { type: [String] },
    description: { type: String },
    date: { type: String, required: true },
    interval: {
      type: String,
      required: true,
      enum: ["daily", "weekly", "bi-weekly", "semi-monthly", "monthly"],
    },
  },
  { timestamps: true }
);

const RecurringTransactionModel = mongoose.model<IRecurringTransaction>(
  "RecurringTransaction",
  recurringTransactionSchema
);

export default RecurringTransactionModel;
