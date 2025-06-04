import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  preferences: {
    currency: {
      type: String,
      default: "CAD", // default currency
    },
    disabledCategories: { type: [String], required: false },
    defaultAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: false,
    },
  },
});

const User = mongoose.model("User", userSchema);

export default User;
