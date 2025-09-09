import mongoose, { Schema } from "mongoose";

const transferSchema: Schema = new Schema(
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
      ref: "Account",
      required: true,
      validate: {
        validator: (arr: unknown[]) => Array.isArray(arr) && arr.length === 2,
        message: "transactionIds must contain exactly 2 Account IDs",
      },
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const TransferModel = mongoose.model("Transfer", transferSchema);

export default TransferModel;
