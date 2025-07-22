import { Request, Response, NextFunction } from "express";
import * as investmentService from "../services/investmentService";
import AccountModel from "../models/account.model";

interface CustomRequest extends Request {
  userId?: string;
  investments?: any;
}

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
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const aggregated = await investmentService.getAggregatedInvestments(
      userId,
      true
    );

    res.json(aggregated);
    return;
  } catch (err) {
    console.error("Error aggregating investments:", err);
    res.status(500).json({ error: "Failed to aggregate investments" });
  }
};

export const searchStocks = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { q } = req.query;
    if (!q || typeof q !== "string") {
      res.status(400).json({ error: "Please provide a search query" });
      return;
    }

    const results = investmentService.searchStocks(q);
    res.status(201).json(results);
  } catch (err) {
    console.error("Error searching stocks:", err);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
};
