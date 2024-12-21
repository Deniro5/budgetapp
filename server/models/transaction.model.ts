import mongoose, { Schema, Model } from "mongoose";

// Mongoose Schema definition
const transactionSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    account: { type: String, required: true },
    category: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User
    vendor: { type: String, required: false },
    //maybe tags later
  },
  { timestamps: true }
); // Enable automatic createdAt and updatedAt fields);

// Create the Mongoose model
const TransactionModel: Model<any> = mongoose.model(
  "Transaction",
  transactionSchema
);

export default TransactionModel;
