import mongoose, { Schema, Model } from "mongoose";

// Mongoose Schema definition
const accountSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    institution: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User
    baselineAmount: { type: Number, required: true },
    baselineDate: { type: String, required: true },
    type: { type: String, required: false },
  },
  { timestamps: true }
);

// Create the Mongoose model
const AccountModel: Model<any> = mongoose.model("Account", accountSchema);

export default AccountModel;
