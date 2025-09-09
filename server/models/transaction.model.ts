import mongoose, { Schema } from "mongoose";

const transactionSchema: Schema = new Schema(
  {
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    category: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vendor: { type: String, required: false },
    tags: { type: [String], required: false },
    description: { type: String, required: false },
  },
  { timestamps: true }
);

const TransactionModel = mongoose.model("Transaction", transactionSchema);

export default TransactionModel;
