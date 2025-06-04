import { Request, Response } from "express";
import PresetTransactionModel from "../models/presettransaction.model";

interface CustomRequest extends Request {
  userId?: string;
}

// Create
export const createPresetTransaction = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { userId } = req;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Count existing transactions for the user
    const transactionCount = await PresetTransactionModel.countDocuments({
      userId,
    });

    if (transactionCount >= 100) {
      res.status(400).json({
        error:
          "Preset Transaction limit reached (100). Please delete an existing preset transaction and try again",
      });
      return;
    }

    const {
      name,
      description,
      amount,
      type,
      date,
      account,
      category,
      vendor,
      tags,
    } = req.body;

    const newTransaction = new PresetTransactionModel({
      name,
      description,
      amount,
      type,
      date,
      account,
      category,
      vendor,
      tags,
      userId,
    });

    const savedTransaction = await newTransaction.save();

    res.status(201).json(savedTransaction);
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ error: "Failed to create transaction" });
  }
};

// ReadOne
export const getPresetTransactionById = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const transaction = await PresetTransactionModel.findOne({
      _id: id,
      userId,
    });

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

//Read
export const getPresetTransactions = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { userId } = req;
    const { limit = 100, sort = "-name" } = req.query;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Query object with only userId
    const query = { userId };

    const transactions = await PresetTransactionModel.find(query)
      .sort(sort as string)
      .limit(Number(limit));

    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// Update
export const updatePresetTransaction = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const updateData = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const transaction = await PresetTransactionModel.findOne({
      _id: id,
      userId,
    });

    if (!transaction) {
      res
        .status(403)
        .json({ error: "You are not authorized to update this transaction" });
      return;
    }

    const updatedTransaction = await PresetTransactionModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json(updatedTransaction);
  } catch (err) {
    console.error("Error updating transaction:", err);
    res.status(500).json({ error: "Failed to update transaction" });
  }
};

// Delete
export const deletePresetTransaction = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const transaction = await PresetTransactionModel.findOne({
      _id: id,
      userId,
    });

    if (!transaction) {
      res
        .status(403)
        .json({ error: "You are not authorized to delete this transaction" });
      return;
    }

    await PresetTransactionModel.findByIdAndDelete(id);

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
};
