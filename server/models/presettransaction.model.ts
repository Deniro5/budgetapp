import mongoose, { Schema, Model } from "mongoose";

// Mongoose Schema definition
const presetTransactionSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User
    description: { type: String, required: false },
    amount: { type: Number, required: false },
    type: { type: String, required: false },
    date: { type: String, required: false },
    account: { type: String, required: false },
    category: { type: String, required: false },
    vendor: { type: String, required: false },
    tags: { type: [String], required: false },
  },
  { timestamps: true }
);

// Create the Mongoose model
const PresetTransactionModel: Model<any> = mongoose.model(
  "PresetTransaction",
  presetTransactionSchema
);

export default PresetTransactionModel;
