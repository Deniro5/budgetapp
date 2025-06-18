import mongoose, { Schema, Model } from "mongoose";

// Mongoose Schema definition for Budget with mapped keys
const budgetSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User
    budgetCategories: {
      type: Map,
      of: {
        type: Number,
        default: 0,
      },
      default: {},
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Ensure a unique budget per user
budgetSchema.index({ userId: 1 }, { unique: true });

// Create the Mongoose model
const BudgetModel: Model<any> = mongoose.model("Budget", budgetSchema);

export default BudgetModel;
