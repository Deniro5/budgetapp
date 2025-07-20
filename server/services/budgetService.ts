import BudgetModel from "../models/budget.model";

export const getOrCreateBudget = async (userId: string) => {
  let budget = await BudgetModel.findOne({ userId });

  if (!budget) {
    budget = await BudgetModel.create({ userId });
    return { created: true, budget };
  }

  return { created: false, budget };
};

export const updateUserBudget = async (userId: string, updateData: any) => {
  const budget = await BudgetModel.findOne({ userId });
  if (!budget) return null;

  const updatedBudget = await BudgetModel.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true }
  );

  return updatedBudget;
};
