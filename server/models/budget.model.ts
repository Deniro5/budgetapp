import mongoose, { Schema } from "mongoose";

const budgetSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    budgetCategories: {
      type: Map,
      of: {
        type: Number,
        default: 0,
      },
      default: {},
    },
  },
  { timestamps: true }
);

budgetSchema.index({ userId: 1 }, { unique: true });

const BudgetModel = mongoose.model("Budget", budgetSchema);

export default BudgetModel;
