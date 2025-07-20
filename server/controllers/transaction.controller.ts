import { Request, Response } from "express";
import * as transactionService from "../services/transactionService";

interface CustomRequest extends Request {
  userId?: string;
}

export const createTransaction = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const transaction = await transactionService.createTransaction({
      userId,
      ...req.body,
    });

    res.status(201).json(transaction);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: err.message || "Failed to create transaction" });
  }
};

export const updateTransaction = async (
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

    const updatedTransaction = await transactionService.updateTransaction(
      userId,
      id,
      req.body
    );

    res.json(updatedTransaction);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: err.message || "Failed to update transaction" });
  }
};

export const deleteTransaction = async (
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

    const deletedTransaction = await transactionService.deleteTransaction(
      userId,
      id
    );

    res.json(deletedTransaction);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: err.message || "Failed to delete transaction" });
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
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const transaction = await transactionService.getTransactionById(userId, id);

    res.json(transaction);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: err.message || "Failed to fetch transaction" });
  }
};

export const getTransactions = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const filters = req.query as any;

    const result = await transactionService.getTransactions(userId, filters);

    res.json(result);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: err.message || "Failed to fetch transactions" });
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
      res.status(401).json({ error: "Unauthorized" });
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
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Server error", error: err.message || err });
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
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const incomeExpense = await transactionService.getTotalIncomeAndExpense(
      userId,
      typeof startDate === "string" ? startDate : undefined,
      typeof endDate === "string" ? endDate : undefined,
      typeof category === "string" ? category : undefined
    );

    res.json(incomeExpense);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Server error", error: err.message || err });
  }
};
