import TransactionModel from "../models/transaction.model";
import mongoose, { FilterQuery } from "mongoose";
import { updateAccountBalance } from "./accountService";

interface CreateTransactionArgs {
  userId: string;
  description: string;
  amount: number;
  type: "Income" | "Expense" | string;
  date: string;
  account: string;
  category?: string;
  vendor?: string;
  tags?: string[];
}

export const createTransaction = async (
  args: CreateTransactionArgs
): Promise<any> => {
  const {
    userId,
    description,
    amount,
    type,
    date,
    account,
    category,
    vendor,
    tags,
  } = args;

  const newTransaction = new TransactionModel({
    userId,
    description,
    amount,
    type,
    date,
    account,
    category,
    vendor,
    tags,
  });

  const savedTransaction = await newTransaction.save();

  await updateAccountBalance({
    accountId: account,
    change: type === "Expense" ? -amount : amount,
  });

  return savedTransaction;
};

export const getTransactionById = async (
  userId: string,
  id: string
): Promise<any> => {
  const transaction = await TransactionModel.findOne({
    _id: id,
    userId,
  }).populate({
    path: "account",
    select: "name _id",
  });

  if (!transaction) throw new Error("Transaction not found or unauthorized");

  return transaction;
};

export const getTransactions = async (
  userId: string,
  filters: {
    q?: string;
    limit?: number;
    offset?: number;
    sort?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
    tags?: string[];
    type?: string;
    minAmount?: number;
    maxAmount?: number;
    account?: string | string[];
  }
): Promise<{ transactions: any[]; transactionCount: number }> => {
  const {
    q,
    limit = 50,
    offset = 0,
    startDate,
    endDate,
    category,
    tags,
    type,
    minAmount,
    maxAmount,
    account,
  } = filters;

  const query: any = { userId };

  if (q) {
    query.$or = [
      { vendor: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }

  if (category) query.category = category;

  if (tags && tags.length > 0) query.tags = { $in: tags };

  if (type) query.type = type;

  if (minAmount || maxAmount) {
    query.amount = {};
    if (minAmount) query.amount.$gte = minAmount;
    if (maxAmount) query.amount.$lte = maxAmount;
  }

  if (account) {
    query.account = { $in: Array.isArray(account) ? account : [account] };
  }

  const transactionCount = await TransactionModel.countDocuments(query);

  const transactions = await TransactionModel.find(query)
    .sort({ date: -1, _id: -1 })
    .skip(offset)
    .limit(limit)
    .populate({ path: "account", select: "name _id" });

  return { transactions, transactionCount };
};

export const updateTransactions = async (
  userId: string,
  transactionIds: string[],
  updateFields: any
): Promise<any> => {
  const transactions = await TransactionModel.find({
    _id: { $in: transactionIds },
    userId,
  });

  if (transactions.length !== transactionIds.length) {
    throw new Error("Unauthorized to update one or more transactions");
  }

  await TransactionModel.updateMany(
    { _id: { $in: transactionIds }, userId },
    { $set: updateFields },
    { new: true }
  );

  if (
    !updateFields["type"] &&
    !updateFields["account"] &&
    !updateFields["amount"]
  )
    return;

  const accountChangesByAccount = transactions.reduce((acc, transaction) => {
    const newType = updateFields["type"] ?? transaction.type;
    const newAccount = updateFields["account"] ?? transaction.account;
    const newAmount = updateFields["amount"] ?? transaction.amount;
    const change =
      (transaction.type === "Expense"
        ? transaction.amount
        : -transaction.amount) -
      (newType === "Expense" ? newAmount : -newAmount);

    if (transaction.account === newAccount) {
      acc[transaction.account] = change + (acc[transaction.account] || 0);
    } else {
      acc[transaction.account] =
        Number(
          transaction.type === "Expense"
            ? transaction.amount
            : -transaction.amount
        ) + (acc[transaction.account] || 0);

      acc[newAccount] =
        Number(newType === "Expense" ? -newAmount : newAmount) +
        (acc[newAccount] || 0);
    }
    return acc;
  }, {});

  Object.keys(accountChangesByAccount).forEach(async (accountId) => {
    await updateAccountBalance({
      accountId,
      change: accountChangesByAccount[accountId],
    });
  });

  return;
};

export const deleteTransactions = async (
  userId: string,
  transactionIds: string[]
) => {
  const transactions = await TransactionModel.find({
    _id: { $in: transactionIds },
    userId,
  });

  if (transactions.length !== transactionIds.length) {
    throw new Error("Unauthorized to delete one or more transactions");
  }

  await TransactionModel.deleteMany({
    _id: { $in: transactionIds },
    userId,
  });

  const accountChangesByAccount = transactions.reduce((acc, cur) => {
    acc[cur.account] =
      Number(cur.type === "Expense" ? cur.amount : -cur.amount) +
      (acc[cur.account] || 0);

    return acc;
  }, {});

  Object.keys(accountChangesByAccount).forEach(async (accountId) => {
    await updateAccountBalance({
      accountId,
      change: accountChangesByAccount[accountId],
    });
  });

  return transactions;
};

export const getTransactionCategoriesByAmount = async (
  userId: string,
  limit?: number,
  startDate?: string,
  endDate?: string
): Promise<
  {
    category: string;
    totalAmount: number;
  }[]
> => {
  const matchConditions: FilterQuery<typeof TransactionModel> = {
    userId: new mongoose.Types.ObjectId(userId),
    type: { $ne: "Income" },
    category: { $ne: "Transfer" },
  };

  if (
    startDate &&
    typeof startDate === "string" &&
    endDate &&
    typeof endDate === "string"
  ) {
    matchConditions.date = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  //sum all transactions by category and then sort by descending total
  const categoryTotals = await TransactionModel.aggregate([
    { $match: matchConditions },
    {
      $group: {
        _id: "$category",
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        totalAmount: 1,
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
  ]);

  if (!limit) return categoryTotals;

  const topCategories = categoryTotals.slice(0, limit);

  const otherTotal = categoryTotals
    .slice(limit)
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  if (otherTotal > 0) {
    topCategories.push({ category: "Other", totalAmount: otherTotal });
  }

  return topCategories;
};

export const getTotalIncomeAndExpense = async (
  userId: string,
  startDate?: string,
  endDate?: string,
  category?: string
): Promise<
  {
    date: string;
    income: number;
    expense: number;
  }[]
> => {
  const matchConditions: Record<string, any> = {
    userId: new mongoose.Types.ObjectId(userId),
  };

  if (startDate || endDate) {
    matchConditions.date = {};
    if (startDate) matchConditions.date.$gte = startDate;
    if (endDate) matchConditions.date.$lte = endDate;
  }

  if (category) {
    matchConditions.$and = [
      { category: category },
      { category: { $ne: "Transfer" } },
    ];
  } else {
    matchConditions.category = { $ne: "Transfer" };
  }

  const transactions = await TransactionModel.find(matchConditions).sort({
    date: 1,
  });

  if (transactions.length === 0) {
    return [];
  }

  let cumulativeIncome = 0;
  let cumulativeExpense = 0;

  const datesWithIncomeAndExpense: Record<
    string,
    { income: number; expense: number }
  > = {};

  transactions.forEach(({ date, amount, type }) => {
    if (type === "Income") {
      cumulativeIncome += amount;
    } else if (type === "Expense") {
      cumulativeExpense += amount;
    }
    datesWithIncomeAndExpense[date] = {
      income: cumulativeIncome,
      expense: cumulativeExpense,
    };
  });

  return Object.entries(datesWithIncomeAndExpense).map(([date, val]) => ({
    date,
    income: val.income,
    expense: val.expense,
  }));
};
