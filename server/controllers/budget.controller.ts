import { Request, Response } from "express";
import BudgetModel from "../models/budget.model";

interface CustomRequest extends Request {
  userId?: string;
}

// Fetch user's budget
export const getBudget = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Find the budget for the user
    let budget = await BudgetModel.findOne({ userId });

    if (!budget) {
      budget = await BudgetModel.create({ userId });
      res.status(201).json({ message: "New budget created", budget });
      return;
    }

    res.json({ budgetCategories: budget.budgetCategories });
  } catch (err) {
    console.error("Error fetching budget:", err);
    res.status(500).json({ error: "Failed to fetch budget" });
  }
};

// Update user's budget
export const updateBudget = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req;
    const updateData = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Find the budget for the user
    const budget = await BudgetModel.findOne({ userId });

    if (!budget) {
      res.status(404).json({ error: "Budget not found" });
      return;
    }

    // Update the budget with the provided data

    const updatedBudget = await BudgetModel.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true }
    );

    res.json({ budgetCategories: updatedBudget.budgetCategories });
  } catch (err) {
    console.error("Error updating budget:", err);
    res.status(500).json({ error: "Failed to update budget" });
  }
};
