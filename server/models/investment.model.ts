import mongoose, { Schema, Document, Types } from "mongoose";

export interface IInvestment extends Document<Types.ObjectId> {
  asset: Types.ObjectId;
  account: Types.ObjectId;
  userId: Types.ObjectId;
  date: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const investmentSchema: Schema<IInvestment> = new Schema(
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

const InvestmentModel = mongoose.model<IInvestment>(
  "Investment",
  investmentSchema
);

export default InvestmentModel;
