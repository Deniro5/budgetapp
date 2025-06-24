import { Request, Response } from "express";
import InvestmentModel from "../models/investment.model";
import { SampleStocks } from "../data/sample-stocks";
import mongoose from "mongoose";

interface CustomRequest extends Request {
  userId?: string;
}

// Create
export const createInvestment = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Count existing transactions for the user
    const investmentCount = await InvestmentModel.countDocuments({
      userId,
    });

    if (investmentCount >= 10) {
      res.status(400).json({
        error:
          "Investment limit reached (10). Please delete an existing investment and try again",
      });
      return;
    }

    const { asset, account, date, quantity, price } = req.body;

    const newInvestment = new InvestmentModel({
      asset,
      account,
      date,
      quantity,
      price,
      userId,
    });

    const savedInvestment = await newInvestment.save();

    res.status(201).json(savedInvestment);
  } catch (err) {
    console.error("Error creating investment:", err);
    res.status(500).json({ error: "Failed to create investment" });
  }
};

export const getInvestments = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req;
    const { limit = 20 } = req.query;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const aggregatedInvestments = await InvestmentModel.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }, // Optional filter
      },
      {
        $group: {
          _id: {
            symbol: "$asset.symbol",
            userId: "$userId",
          },
          name: { $first: "$asset.name" },
          exchange: { $first: "$asset.exchange" },
          totalQuantity: { $sum: "$quantity" },
          totalValue: { $sum: { $multiply: ["$quantity", "$price"] } },
          entries: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          asset: {
            symbol: "$_id.symbol",
            name: "$name",
            exchange: "$exchange",
          },
          userId: "$_id.userId",
          quantity: "$totalQuantity",
          price: {
            $cond: [
              { $eq: ["$totalQuantity", 0] },
              0,
              { $divide: ["$totalValue", "$totalQuantity"] },
            ],
          },
          entries: 1,
        },
      },
    ]);

    res.json(aggregatedInvestments);
  } catch (err) {
    console.error("Error fetching investments:", err);
    res.status(500).json({ error: "Failed to fetch investments" });
  }
};
export const searchStocks = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { q } = req.query;

    if (!q) {
      res.status(400).json({ error: "Please provide a search query" });
      return;
    }
    const stringQuery = q as string;

    const lowerCaseQuery = stringQuery.toLowerCase();

    const searchResults = SampleStocks.filter((stock) => {
      return (
        stock.symbol.toLowerCase().includes(lowerCaseQuery) ||
        stock.name.toLowerCase().includes(lowerCaseQuery)
      );
    }).slice(0, 20);

    res.status(201).json(searchResults);
  } catch (err) {
    console.error("Error fetching search results:", err);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
};
