import mongoose, { Schema } from "mongoose";

const investmentSchema: Schema = new Schema(
  {
    asset: { type: Schema.Types.ObjectId, ref: "Asset", required: true },
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const InvestmentModel = mongoose.model("Investment", investmentSchema);

export default InvestmentModel;
