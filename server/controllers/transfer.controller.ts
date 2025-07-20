import { Request, Response } from "express";
import * as transferService from "../services/transferService";

interface CustomRequest extends Request {
  userId?: string;
}

export const createTransfer = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { sendingAccountId, receivingAccountId, amount, date } = req.body;

    const result = await transferService.createTransfer({
      userId,
      sendingAccountId,
      receivingAccountId,
      amount,
      date,
    });

    // Populate accounts (optional, can do in service if preferred)
    await result.transactions[0].populate({
      path: "account",
      select: "name _id",
    });
    await result.transactions[1].populate({
      path: "account",
      select: "name _id",
    });

    res.status(201).json({
      transactions: result.transactions,
      transfer: result.transfer,
    });
  } catch (err) {
    console.error("Error creating transfer:", err);
    res.status(500).json({ error: "Failed to create transfer" });
  }
};

export const updateTransferByTransactionId = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const updateData = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const result = await transferService.updateTransferByTransactionId(
      userId,
      id,
      updateData
    );

    res.json(result);
  } catch (err: any) {
    console.error("Error updating transfer:", err);
    res.status(500).json({ error: err.message || "Failed to update transfer" });
  }
};

export const deleteTransferByTransactionId = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const deletedTransactionIds =
      await transferService.deleteTransferByTransactionId(userId, id);

    res.json({ deletedTransactionIds });
  } catch (err: any) {
    console.error("Error deleting transfer:", err);
    res.status(500).json({ error: err.message || "Failed to delete transfer" });
  }
};
