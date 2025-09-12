import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITransfer extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  amount: number;
  date: string;
  sendingAccountId: Types.ObjectId;
  receivingAccountId: Types.ObjectId;
  transactionIds: [Types.ObjectId, Types.ObjectId]; // exactly 2 transaction IDs
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const transferSchema: Schema<ITransfer> = new Schema(
  {
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    sendingAccountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    receivingAccountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    transactionIds: {
      type: [Schema.Types.ObjectId],
      ref: "Transaction",
      required: true,
      validate: {
        validator: (arr: unknown[]) => Array.isArray(arr) && arr.length === 2,
        message: "transactionIds must contain exactly 2 Transaction IDs",
      },
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const TransferModel: Model<ITransfer> = mongoose.model<ITransfer>(
  "Transfer",
  transferSchema
);

export default TransferModel;
