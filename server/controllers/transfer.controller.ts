import { Request, Response } from "express";
import TransactionModel from "../models/transaction.model";
import TransferModel from "../models/transfer.model";
import mongoose from "mongoose";

interface CustomRequest extends Request {
  userId?: string;
}

// Create
export const createTransfer = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { sendingAccountId, receivingAccountId, amount, date } = req.body;

    const sendingTransaction = new TransactionModel({
      userId,
      description: "",
      amount,
      type: "Expense",
      date,
      account: sendingAccountId,
      category: "transfer",
      vendor: receivingAccountId,
      tags: [],
    });

    const receivingTransaction = new TransactionModel({
      userId,
      description: "",
      amount,
      type: "Income",
      date,
      account: receivingAccountId,
      category: "transfer",
      vendor: sendingAccountId,
      tags: [],
    });

    if (receivingTransaction && sendingTransaction) {
      const transfer = new TransferModel({
        userId,
        sendingAccountId,
        receivingAccountId,
        transactionIds: [sendingTransaction._id, receivingTransaction._id],
        amount,
        date,
      });

      await receivingTransaction.save();
      await sendingTransaction.save();
      await transfer.save();
    }

    res
      .status(201)
      .json({ transactions: [receivingTransaction, sendingTransaction] });
  } catch (err) {
    console.error("Error creating transfer:", err);
    res.status(500).json({ error: "Failed to create transfer" });
  }
};

// Update
export const updateTransferByTransactionId = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const updateData = req.body;
    //sendingAccountId, receivingAccountId, date, amount

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const transferToUpdate = await TransferModel.findOne({
      userId,
      transactionIds: { $in: [id] },
    });

    if (!transferToUpdate) {
      res.status(403).json({ error: "Transfer not found" });
      return;
    }

    const updatedTransfer = await TransactionModel.findByIdAndUpdate(
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
export const deleteTransferByTransactionId = async (
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

    const transferToDelete = await TransferModel.findOne({
      userId,
      transactionIds: { $in: [id] },
    });

    if (!transferToDelete) {
      res.status(404).json({ error: "Transfer not found" });
      return;
    }

    await TransactionModel.deleteMany({
      _id: { $in: transferToDelete.transactionIds },
      userId, // optional, to ensure only the user's transactions are deleted
    });
    await transferToDelete.deleteOne();

    res.json({ deletedTransactionIds: transferToDelete.transactionIds });
  } catch (err) {
    console.error("Error deleting transfer:", err);
    res.status(500).json({ error: "Failed to delete transfer" });
  }
};

// // ReadOne
// export const getTransactionById = async (req: CustomRequest, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { userId } = req;

//     if (!userId) {
//       res.status(401).json({ error: "Unauthorized" });
//       return;
//     }

//     const transaction = await TransactionModel.findOne({ _id: id, userId });

//     if (!transaction) {
//       res.status(404).json({ error: "Transaction not found or unauthorized" });
//       return;
//     }

//     res.json(transaction);
//   } catch (err) {
//     console.error("Error fetching transaction:", err);
//     res.status(500).json({ error: "Failed to fetch transaction" });
//   }
// };

// //Read
// export const getTransactions = async (req: CustomRequest, res: Response) => {
//   try {
//     const { userId } = req;
//     const {
//       q,
//       limit = 50,
//       offset = 0,
//       sort = "-date",
//       startDate,
//       endDate,
//       categories,
//       tags,
//       type,
//       minAmount,
//       maxAmount,
//       accounts,
//     } = req.query;

//     if (!userId) {
//       res.status(401).json({ error: "Unauthorized" });
//       return;
//     }

//     // Build the query object
//     const query: any = { userId };

//     if (q) {
//       query.$or = [
//         { name: { $regex: q, $options: "i" } }, // Replace 'field1' with the field you want to search
//         { vendor: { $regex: q, $options: "i" } }, // Add more fields if needed
//         { description: { $regex: q, $options: "i" } }, // Add more fields if needed
//       ];
//     }

//     // Date range filter
//     if (startDate || endDate) {
//       query.date = {};
//       if (startDate) query.date.$gte = startDate;
//       if (endDate) query.date.$lte = endDate;
//     }

//     // Category filter
//     if (categories && categories.length) {
//       query.category = {
//         $in: categories,
//       };
//     }

//     // Tags filter
//     if (tags && tags.length) {
//       query.tags = {
//         $in: tags,
//       };
//     }

//     // Type filter
//     if (type) {
//       query.type = type;
//     }

//     // Amount range filter
//     if (minAmount || maxAmount) {
//       query.amount = {};
//       if (minAmount) query.amount.$gte = Number(minAmount);
//       if (maxAmount) query.amount.$lte = Number(maxAmount);
//     }

//     // Account filter
//     if (accounts) {
//       query.account = { $in: Array.isArray(accounts) ? accounts : [accounts] };
//     }

//     const transactionCount = await TransactionModel.countDocuments(query);

//     const transactions = await TransactionModel.find(query)
//       .sort({ date: -1, _id: -1 }) // Sort by date first, then by _id for uniqueness
//       .skip(Number(offset)) // Skip `offset` number of documents
//       .limit(Number(limit)); // Limit the number of results

//     res.json({ transactions, transactionCount });
//   } catch (err) {
//     console.error("Error fetching transactions:", err);
//     res.status(500).json({ error: "Failed to fetch transactions" });
//   }
// };

// // Update
// export const updateTransaction = async (req: CustomRequest, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { userId } = req;
//     const updateData = req.body;

//     if (!userId) {
//       res.status(401).json({ error: "Unauthorized" });
//       return;
//     }

//     const transaction = await TransactionModel.findOne({ _id: id, userId });

//     if (!transaction) {
//       res
//         .status(403)
//         .json({ error: "You are not authorized to update this transaction" });
//       return;
//     }

//     const updatedTransaction = await TransactionModel.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true }
//     );

//     res.json(updatedTransaction);
//   } catch (err) {
//     console.error("Error updating transaction:", err);
//     res.status(500).json({ error: "Failed to update transaction" });
//   }
// };

// // Delete
// export const deleteTransaction = async (req: CustomRequest, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { userId } = req;

//     if (!userId) {
//       res.status(401).json({ error: "Unauthorized" });
//       return;
//     }

//     const transaction = await TransactionModel.findOne({ _id: id, userId });

//     if (!transaction) {
//       res
//         .status(403)
//         .json({ error: "You are not authorized to delete this transaction" });
//       return;
//     }

//     await TransactionModel.findByIdAndDelete(id);

//     res.json({ message: "Transaction deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting transaction:", err);
//     res.status(500).json({ error: "Failed to delete transaction" });
//   }
// };

// export const getTransactionCategoriesByAmount = async (
//   req: CustomRequest,
//   res: Response
// ) => {
//   try {
//     const { userId } = req;
//     const { limit, startDate, endDate } = req.query;

//     const matchConditions: Record<string, any> = {
//       userId: new mongoose.Types.ObjectId(userId),
//       type: { $ne: "Income" },
//     };

//     // Apply date filtering if startDate and endDate are provided

//     if (
//       startDate &&
//       typeof startDate === "string" &&
//       endDate &&
//       typeof endDate === "string"
//     ) {
//       matchConditions.date = {
//         $gte: startDate,
//         $lte: endDate,
//       };
//     }

//     const categoryTotals = await TransactionModel.aggregate([
//       {
//         $match: matchConditions,
//       },
//       {
//         $group: {
//           _id: "$category", // Group by category
//           totalAmount: { $sum: "$amount" }, // Sum the amounts
//         },
//       },
//       {
//         $project: {
//           _id: 0, // Remove _id field from output
//           category: "$_id",
//           totalAmount: 1,
//         },
//       },
//       {
//         $sort: { totalAmount: -1 }, // Sort by totalAmount in descending order
//       },
//     ]);

//     const limitNum = Number(limit) || categoryTotals.length;
//     const topCategories = categoryTotals.slice(0, limitNum);

//     const otherTotal = categoryTotals
//       .slice(limitNum)
//       .reduce((acc, curr) => acc + curr.totalAmount, 0);

//     if (otherTotal > 0) {
//       topCategories.push({ category: "Other", totalAmount: otherTotal });
//     }

//     res.json({ categoryTotals: topCategories });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// export const getTotalIncomeAndExpense = async (
//   req: CustomRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { userId } = req;
//     const { startDate, endDate, category } = req.query as {
//       startDate?: string;
//       endDate?: string;
//       category?: string;
//     };

//     if (!userId) {
//       res.status(401).json({ error: "Unauthorized" });
//       return;
//     }

//     // Category filter
//     const matchConditions: Record<string, any> = {
//       userId: new mongoose.Types.ObjectId(userId),
//     };

//     // Apply date filtering if provided
//     if (startDate || endDate) {
//       matchConditions.date = {};
//       if (startDate) matchConditions.date.$gte = startDate;
//       if (endDate) matchConditions.date.$lte = endDate;
//     }

//     if (category) matchConditions.category = category;

//     // Fetch and sort transactions by date
//     const transactions = await TransactionModel.find(matchConditions).sort({
//       date: 1,
//     });

//     if (transactions.length === 0) {
//       res.json([]);
//       return;
//     }

//     let cumulativeIncome = 0;
//     let cumulativeExpense = 0;

//     let datesWithIncomeAndExpense: Record<
//       string,
//       { income: number; expense: number }
//     > = {};

//     transactions.forEach(({ date, amount, type }) => {
//       if (type === "Income") {
//         cumulativeIncome += amount;
//       } else if (type === "Expense") {
//         cumulativeExpense += amount;
//       }

//       datesWithIncomeAndExpense[date] = {
//         expense: cumulativeExpense,
//         income: cumulativeIncome,
//       };
//     });

//     const result = Object.keys(datesWithIncomeAndExpense).map((date) => {
//       return {
//         date,
//         ...datesWithIncomeAndExpense[date],
//       };
//     });

//     res.json(result);
//   } catch (error) {
//     console.error("Error fetching total income and expense:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };
