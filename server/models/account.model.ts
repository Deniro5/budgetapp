import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAccount extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  name: string;
  institution: string;
  userId: Types.ObjectId;
  baselineAmount: number;
  baselineDate: string;
  type?: string;
  balance: number;
  isArchived?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema: Schema<IAccount> = new Schema(
  {
    name: { type: String, required: true },
    institution: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User
    baselineAmount: { type: Number, required: true },
    baselineDate: { type: String, required: true },
    type: { type: String },
    balance: { type: Number, required: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const AccountModel = mongoose.model<IAccount>("Account", accountSchema);

export default AccountModel;
