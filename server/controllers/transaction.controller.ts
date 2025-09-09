import { Request, Response } from "express";
import * as transactionService from "../services/transactionService";
import { CustomRequest } from "../types";

export const createTransaction = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const transaction = await transactionService.createTransaction({
      userId,
      ...req.body,
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ message: "Failed to create transaction" });
  }
};

export const updateTransactions = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    const { id } = req.params;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { transactionIds, updatedFields } = req.body;
    await transactionService.updateTransactions(
      userId,
      transactionIds,
      updatedFields
    );

    res.status(201).json({ message: "Transactions updated successfully" });
  } catch (err) {
    console.error("Error updating transactions:", err);
    res.status(500).json({ message: "Failed to update transactions" });
  }
};

export const deleteTransactions = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const transactionIds = req.body;

    const deletedTransactions = await transactionService.deleteTransactions(
      userId,
      transactionIds
    );

    res.json(deletedTransactions);
  } catch (err) {
    console.error("Error deleting transactions:", err);
    res.status(500).json({ message: "Failed to delete transactions" });
  }
};

export const getTransactionById = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    const { id } = req.params;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const transaction = await transactionService.getTransactionById(userId, id);

    res.json(transaction);
  } catch (err) {
    console.error("Error fetching transaction by ID:", err);
    res.status(500).json({ message: "Failed to fetch transaction" });
  }
};

export const getTransactions = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const filters = req.query;

    const result = await transactionService.getTransactions(userId, filters);

    res.json(result);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

export const getTransactionCategoriesByAmount = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    const { limit, startDate, endDate } = req.query;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const limitNum = limit ? Number(limit) : undefined;

    const categories =
      await transactionService.getTransactionCategoriesByAmount(
        userId,
        limitNum,
        typeof startDate === "string" ? startDate : undefined,
        typeof endDate === "string" ? endDate : undefined
      );

    res.json({ categoryTotals: categories });
  } catch (err) {
    console.error("Error fetching transaction categories by amount:", err);
    res.status(500).json({ message: "Failed to fetch transaction categories" });
  }
};

export const getTotalIncomeAndExpense = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    const { startDate, endDate, category } = req.query;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const incomeExpense = await transactionService.getTotalIncomeAndExpense(
      userId,
      typeof startDate === "string" ? startDate : undefined,
      typeof endDate === "string" ? endDate : undefined,
      typeof category === "string" ? category : undefined
    );

    res.json(incomeExpense);
  } catch (err) {
    console.error("Error fetching total income and expense:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch total income and expense" });
  }
};
