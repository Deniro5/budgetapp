import mongoose, { Schema, Model } from "mongoose";

// Mongoose Schema definition
const recurringTransactionSchema: Schema = new Schema(
  {
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true }, // Reference to the Account
    category: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User
    vendor: { type: String, required: true },
    tags: { type: [String], required: false },
    description: { type: String, required: false },
    date: { type: String, required: true },
    interval: {
      type: String,
      required: true,
      enum: ["daily", "weekly", "bi-weekly", "monthly"],
    },
  },
  { timestamps: true }
); // Enable automatic createdAt and updatedAt fields);

// Create the Mongoose model
const RecurringTransactionModel: Model<any> = mongoose.model(
  "RecurringTransaction",
  recurringTransactionSchema
);

export default RecurringTransactionModel;
