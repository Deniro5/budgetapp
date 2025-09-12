import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITransaction extends Document<Types.ObjectId> {
  amount: number;
  type: string;
  date: string;
  account: Types.ObjectId;
  category: string;
  userId: Types.ObjectId;
  vendor?: string;
  tags?: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema: Schema<ITransaction> = new Schema(
  {
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    category: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vendor: { type: String },
    tags: { type: [String] },
    description: { type: String },
  },
  { timestamps: true }
);

const TransactionModel = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);

export default TransactionModel;
