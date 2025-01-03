import { Request, Response } from "express";
import TransactionModel from "../models/transaction.model";

interface CustomRequest extends Request {
  userId?: string;
}

// Create
export const createTransaction = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { name, description, amount, type, date, account, category, vendor } =
      req.body;

    const newTransaction = new TransactionModel({
      userId,
      name,
      description,
      amount,
      type,
      date,
      account,
      category,
      vendor,
    });

    const savedTransaction = await newTransaction.save();

    res.status(201).json(savedTransaction);
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ error: "Failed to create transaction" });
  }
};

// ReadOne
export const getTransactionById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const transaction = await TransactionModel.findOne({ _id: id, userId });

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
export const getTransactions = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req;
    const {
      q,
      limit = 100,
      sort = "-date",
      startDate,
      endDate,
      categories,
      types,
      minAmount,
      maxAmount,
      accounts,
    } = req.query;

    console.log(req.query);

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Build the query object
    const query: any = { userId };
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } }, // Replace 'field1' with the field you want to search
        { vendor: { $regex: q, $options: "i" } }, // Add more fields if needed
        { description: { $regex: q, $options: "i" } }, // Add more fields if needed
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    // Category filter
    if (categories) {
      query.category = {
        $in: Array.isArray(categories) ? categories : [categories],
      };
    }

    // Type filter
    if (types) {
      query.type = { $in: Array.isArray(types) ? types : [types] };
    }

    // Amount range filter
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    // Account filter
    if (accounts) {
      query.account = { $in: Array.isArray(accounts) ? accounts : [accounts] };
    }

    const transactions = await TransactionModel.find(query)
      .sort(sort as string)
      .limit(Number(limit));

    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// Update
export const updateTransaction = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const updateData = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const transaction = await TransactionModel.findOne({ _id: id, userId });

    if (!transaction) {
      res
        .status(403)
        .json({ error: "You are not authorized to update this transaction" });
      return;
    }

    const updatedTransaction = await TransactionModel.findByIdAndUpdate(
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
export const deleteTransaction = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const transaction = await TransactionModel.findOne({ _id: id, userId });

    if (!transaction) {
      res
        .status(403)
        .json({ error: "You are not authorized to delete this transaction" });
      return;
    }

    await TransactionModel.findByIdAndDelete(id);

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
};
