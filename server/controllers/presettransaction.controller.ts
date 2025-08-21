import { Request, Response } from "express";
import * as presetTransactionService from "../services/presetTransactionService";

interface CustomRequest extends Request {
  userId?: string;
}

export const createPresetTransaction = async (
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
        await presetTransactionService.createPresetTransaction({
          ...req.body,
          userId,
        });

      res.status(201).json(newTransaction);
    } catch (error: any) {
      if (error.message.includes("Preset Transaction limit reached")) {
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

export const getPresetTransactionById = async (
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

    const transaction = await presetTransactionService.getPresetTransactionById(
      id,
      userId
    );

    if (!transaction) {
      res.status(404).json({ error: "Transaction not found or unauthorized" });
      return;
    }

    res.json(transaction);
  } catch (err) {
    console.error("Error fetching transaction:", err);
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
};

export const getPresetTransactions = async (
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
      await presetTransactionService.getPresetTransactions({
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
      presetTransactions: transactions,
      presetTransactionCount: count,
    });
  } catch (err) {
    console.error("Error fetching preset transactions:", err);
    res.status(500).json({ error: "Failed to fetch preset transactions" });
  }
};

export const updatePresetTransactions = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    console.log(req.body);
    const { presetTransactionIds, updatedFields } = req.body;
    console.log(presetTransactionIds, updatedFields);

    await presetTransactionService.updatePresetTransactions(
      presetTransactionIds,
      userId,
      updatedFields
    );
    res
      .status(201)
      .json({ messsage: "Preset Transactions updated successfully" });
  } catch (err) {
    console.error("Error updating preset transaction:", err);
    res.status(500).json({ error: "Failed to update preset transaction" });
  }
};

export const deletePresetTransactions = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const presetTransactionIds: string[] = req.body;

    const deleted = await presetTransactionService.deletePresetTransactions(
      presetTransactionIds,
      userId
    );

    res
      .status(201)
      .json({ messsage: "Preset Transactions deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting preset transactions:", err);
    res.status(500).json({ error: "Failed to delete preset transactions" });
  }
};
