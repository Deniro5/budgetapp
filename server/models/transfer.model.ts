import mongoose, { Schema, Model } from "mongoose";

// Mongoose Schema definition
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
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User
  },
  { timestamps: true }
);

const TransferModel: Model<any> = mongoose.model("Transfer", transferSchema);

export default TransferModel;
