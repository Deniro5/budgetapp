import mongoose, { Schema, Model } from "mongoose";

// Mongoose Schema definition
const investmentSchema: Schema = new Schema(
  {
    asset: { type: Schema.Types.ObjectId, ref: "Asset", required: true },
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true }, // Reference to the Account
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User
    date: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

// Create the Mongoose model
const InvestmentModel: Model<any> = mongoose.model(
  "Investment",
  investmentSchema
);

export default InvestmentModel;
