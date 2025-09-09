import { Response } from "express";
import * as investmentService from "../services/investmentService";
import { CustomRequest } from "../types";

export const createInvestment = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { asset, account, date, quantity, price } = req.body;

    const newInvestment = await investmentService.createInvestment({
      userId,
      asset,
      account,
      date,
      quantity,
      price,
    });

    res.status(201).json(newInvestment);
  } catch (err) {
    console.error("Error creating investment:", err);
    res.status(500).json({ error: "Failed to create investment" });
  }
};

export const deleteInvestment = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    const { id } = req.params;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const deletedTransaction = await investmentService.deleteInvestment(
      userId,
      id
    );

    res.json(deletedTransaction);
  } catch (err) {
    console.error("Error deleting investment:", err);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
};

export const getAllInvestments = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const investments = await investmentService.getAllInvestments(userId);
    res.json(investments);
  } catch (err) {
    console.error("Error fetching investments:", err);
    res.status(500).json({ error: "Failed to fetch investments" });
  }
};

export const getCurrentAggregatedInvestments = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const aggregated = await investmentService.getAggregatedInvestments(userId);

    res.json(aggregated);
    return;
  } catch (err) {
    console.error("Error aggregating investments:", err);
    res.status(500).json({ error: "Failed to aggregate investments" });
  }
};
