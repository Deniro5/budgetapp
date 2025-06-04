import mongoose, { Schema, Model } from "mongoose";

// Mongoose Schema definition
const transactionSchema: Schema = new Schema(
  {
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true }, // Reference to the Account
    category: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User
    vendor: { type: String, required: false },
    tags: { type: [String], required: false },
    description: { type: String, required: false },
    name: { type: String, required: false }, // not used for now
  },
  { timestamps: true }
); // Enable automatic createdAt and updatedAt fields);

// Create the Mongoose model
const TransactionModel: Model<any> = mongoose.model(
  "Transaction",
  transactionSchema
);

export default TransactionModel;
