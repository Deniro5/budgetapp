import mongoose, { Schema, Model } from "mongoose";

const recurringTransactionSchema: Schema = new Schema(
  {
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    category: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vendor: { type: String, required: true },
    tags: { type: [String], required: false },
    description: { type: String, required: false },
    date: { type: String, required: true },
    interval: {
      type: String,
      required: true,
      enum: ["daily", "weekly", "bi-weekly", "semi-monthly", "monthly"],
    },
  },
  { timestamps: true }
);

const RecurringTransactionModel = mongoose.model(
  "RecurringTransaction",
  recurringTransactionSchema
);

export default RecurringTransactionModel;
