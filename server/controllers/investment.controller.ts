import { Request, Response } from "express";
import InvestmentModel from "../models/investment.model";
import { SampleStocks } from "../data/sample-stocks";

interface CustomRequest extends Request {
  userId?: string;
}

// Create
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

    const { symbol, account, date, quantity, price } = req.body;

    const newInvestment = new InvestmentModel({
      symbol,
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
