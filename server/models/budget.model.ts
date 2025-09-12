import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IBudget extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  budgetCategories: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema: Schema<IBudget> = new Schema(
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

// ensure one budget per user
budgetSchema.index({ userId: 1 }, { unique: true });

const BudgetModel: Model<IBudget> = mongoose.model<IBudget>(
  "Budget",
  budgetSchema
);

export default BudgetModel;
