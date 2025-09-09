import { Response } from "express";
import * as budgetService from "../services/budgetService";
import { CustomRequest } from "../types";

export const getBudget = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { created, budget } = await budgetService.getOrCreateBudget(userId);

    if (created) {
      res.status(201).json({ message: "New budget created", budget });
      return;
    }

    res.json({ budgetCategories: budget.budgetCategories });
  } catch (err) {
    console.error("Error fetching budget:", err);
    res.status(500).json({ error: "Failed to fetch budget" });
  }
};

export const updateBudget = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    const updateData = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const updatedBudget = await budgetService.updateUserBudget(
      userId,
      updateData
    );

    if (!updatedBudget) {
      res.status(404).json({ error: "Budget not found" });
      return;
    }

    res.json({ budgetCategories: updatedBudget.budgetCategories });
  } catch (err) {
    console.error("Error updating budget:", err);
    res.status(500).json({ error: "Failed to update budget" });
  }
};
