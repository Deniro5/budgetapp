import mongoose, { Schema, Model } from "mongoose";

const accountSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    institution: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User
    baselineAmount: { type: Number, required: true },
    baselineDate: { type: String, required: true },
    type: { type: String, required: false },
    balance: { type: Number, required: true },
    isArchived: { type: Boolean, default: false, required: false },
  },
  { timestamps: true }
);

const AccountModel = mongoose.model("Account", accountSchema);

export default AccountModel;
