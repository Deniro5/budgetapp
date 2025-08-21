import { Request, Response } from "express";
import * as recurringTransactionService from "../services/recurringTransactionService";

interface CustomRequest extends Request {
  userId?: string;
}

export const createRecurringTransaction = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const newTransaction =
        await recurringTransactionService.createRecurringTransaction({
          ...req.body,
          userId,
        });

      res.status(201).json(newTransaction);
    } catch (error: any) {
      if (error.message.includes("Recurring Transaction limit reached")) {
        res.status(400).json({ error: error.message });
        return;
      }
      throw error;
    }
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ error: "Failed to create transaction" });
  }
};

export const getRecurringTransactionById = async (
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

    const transaction =
      await recurringTransactionService.getRecurringTransactionById(id, userId);

    if (!transaction) {
      res
        .status(404)
        .json({ error: "Recurring transaction not found or unauthorized" });
      return;
    }

    res.json(transaction);
  } catch (err) {
    console.error("Error fetching transaction:", err);
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
};

export const getRecurringTransactions = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    const {
      q,
      limit = "100",
      offset = "0",
      sort = "-createdAt",
      category,
      tags,
      type,
      minAmount,
      maxAmount,
      account,
    } = req.query;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { transactions, count } =
      await recurringTransactionService.getRecurringTransactions({
        userId,
        q: q as string | undefined,
        limit: Number(limit),
        offset: Number(offset),
        sort: sort as string,
        category: category as string | undefined,
        tags: tags as string | string[] | undefined,
        type: type as string | undefined,
        minAmount: minAmount ? Number(minAmount) : undefined,
        maxAmount: maxAmount ? Number(maxAmount) : undefined,
        account: account as string | string[] | undefined,
      });

    res.json({
      recurringTransactions: transactions,
      recurringTransactionCount: count,
    });
  } catch (err) {
    console.error("Error fetching recurring transactions:", err);
    res.status(500).json({ error: "Failed to fetch recurring transactions" });
  }
};

export const updateRecurringTransactions = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { recurringTransactionIds, updatedFields } = req.body;

    // Call service to handle bulk update
    await recurringTransactionService.updateRecurringTransactions(
      recurringTransactionIds,
      userId,
      updatedFields
    );

    res
      .status(201)
      .json({ message: "Recurring transactions updated successfully" });
  } catch (err) {
    console.error("Error updating recurring transactions:", err);
    res.status(500).json({ error: "Failed to update recurring transactions" });
  }
};

export const deleteRecurringTransactions = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const recurringTransactionIds: string[] = req.body;

    await recurringTransactionService.deleteRecurringTransactions(
      recurringTransactionIds,
      userId
    );

    res
      .status(201)
      .json({ message: "Recurring transactions deleted successfully" });
  } catch (err) {
    console.error("Error deleting recurring transactions:", err);
    res.status(500).json({ error: "Failed to delete recurring transactions" });
  }
};
