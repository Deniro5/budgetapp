import mongoose, { Schema, Model } from "mongoose";

// Mongoose Schema definition for Budget with mapped keys
const budgetSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User
    budgetCategories: {
      charity: { type: Number, default: 0 },
      childcare: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      entertainment: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      gas: { type: Number, default: 0 },
      gifts: { type: Number, default: 0 },
      groceries: { type: Number, default: 0 },
      healthandfitness: { type: Number, default: 0 },
      hobbies: { type: Number, default: 0 },
      homeimprovement: { type: Number, default: 0 },
      housing: { type: Number, default: 0 },
      insurance: { type: Number, default: 0 },
      internet: { type: Number, default: 0 },
      personalcare: { type: Number, default: 0 },
      pets: { type: Number, default: 0 },
      phone: { type: Number, default: 0 },
      salary: { type: Number, default: 0 },
      subscriptions: { type: Number, default: 0 },
      transit: { type: Number, default: 0 },
      travel: { type: Number, default: 0 },
      utilities: { type: Number, default: 0 },
      workexpenses: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Ensure a unique budget per user
budgetSchema.index({ userId: 1 }, { unique: true });

// Create the Mongoose model
const BudgetModel: Model<any> = mongoose.model("Budget", budgetSchema);

export default BudgetModel;
