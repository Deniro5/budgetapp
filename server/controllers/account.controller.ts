import e, { Request, Response } from "express";
import AccountModel from "../models/account.model";
import TransactionModel from "../models/transaction.model";
import mongoose from "mongoose";
import { start } from "repl";

interface CustomRequest extends Request {
  userId?: string;
}

// Create
export const createAccount = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Count existing transactions for the user
    const accountCount = await AccountModel.countDocuments({
      userId,
    });

    if (accountCount >= 50) {
      res.status(400).json({
        error:
          "Accoount limit reached (50). Please delete an existing account and try again",
      });
      return;
    }

    const { name, institution, baselineAmount, baselineDate, type } = req.body;

    const newAccount = new AccountModel({
      userId,
      name,
      institution,
      baselineAmount,
      baselineDate,
      type,
    });

    const savedAccount = await newAccount.save();

    res.status(201).json(savedAccount);
  } catch (err) {
    console.error("Error creating account:", err);
    res.status(500).json({ error: "Failed to create account" });
  }
};

// ReadOne
export const getAccountById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const account = await AccountModel.findOne({ _id: id, userId });

    if (!account) {
      res.status(404).json({ error: "Account not found or unauthorized" });
      return;
    }

    res.json(account);
  } catch (err) {
    console.error("Error fetching account:", err);
    res.status(500).json({ error: "Failed to fetch account" });
  }
};

const getAccountBalanceAtDate = async ({
  userId,
  accountId,
  baselineAmount,
  baselineDate,
  startDate,
}: {
  userId: string;
  accountId: string;
  baselineAmount: number;
  baselineDate: string;
  startDate: string;
}): Promise<number> => {
  if (startDate <= baselineDate) {
    return 0;
  }

  const transactions = await TransactionModel.find({
    userId,
    account: accountId,
    date: {
      $gte: baselineDate,
      $lt: startDate,
    },
  });

  const delta = transactions.reduce((acc, cur) => {
    return acc + (cur.type === "Income" ? cur.amount : -cur.amount);
  }, 0);

  return baselineAmount + delta;
};

const getAccountTransactionsFromStartToEnd = async ({
  userId,
  accountId,
  startDate,
  baselineDate,
  baselineAmount,
  endDate,
}: {
  userId: string;
  accountId: string;
  startDate: string;
  baselineDate: string;
  baselineAmount: number;
  endDate: string;
}): Promise<any[]> => {
  const transactionsFromBaselineToEndDate = await TransactionModel.find({
    userId,
    account: accountId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  });
  //add the baseline contribution as a transaction
  if (startDate === baselineDate) {
    transactionsFromBaselineToEndDate.unshift({
      date: startDate,
      amount: baselineAmount,
      type: "Income",
    });
  }

  return transactionsFromBaselineToEndDate;
};

export const getAccountBalancesById = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const { startDate, endDate } = req.query;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (!endDate || !startDate) {
      res.status(400).json({ error: "Missing start / end date" });
      return;
    }
    if (endDate < startDate) {
      res.status(400).json({ error: "Start date must be before end date" });
      return;
    }

    if (typeof startDate !== "string" || typeof endDate !== "string") {
      res.status(400).json({ error: "Invalid date types" });
      return;
    }

    const accounts = [];

    if (id === "All") {
      const allAccounts = await AccountModel.find({ userId });
      accounts.push(...allAccounts);
    } else {
      const account = await AccountModel.findOne({ _id: id, userId });
      if (!account) {
        res.status(404).json({ error: "Account not found or unauthorized" });
        return;
      }
      accounts.push(account);
    }
    let transactionTotal = 0;
    let allTransactionsAfterStartDate = [];
    let earliestDate = null;

    for (const account of accounts) {
      const { _id, baselineAmount, baselineDate } = account;
      const accountBalanceAtStartDate = await getAccountBalanceAtDate({
        userId,
        accountId: _id,
        baselineAmount,
        baselineDate,
        startDate,
      });
      transactionTotal += accountBalanceAtStartDate;
      const laterStartDate =
        startDate < baselineDate ? baselineDate : startDate;
      //keep track of the earliest date so we can use that as a starting point for the graph
      if (!earliestDate || laterStartDate < earliestDate) {
        earliestDate = laterStartDate;
      }
      const transactionsFromLatestStartDateToEndDate =
        await getAccountTransactionsFromStartToEnd({
          userId,
          accountId: _id,
          startDate: laterStartDate,
          baselineDate,
          baselineAmount,
          endDate,
        });
      allTransactionsAfterStartDate.push(
        ...transactionsFromLatestStartDateToEndDate
      );
    }
    const sortedTransactionsAfterStartDate = allTransactionsAfterStartDate.sort(
      (a: any, b: any) => (a.date > b.date ? 1 : -1)
    );
    const startingBalance = transactionTotal;
    const cumulativeBalancesMap: Record<string, number> = {};

    sortedTransactionsAfterStartDate.forEach(
      ({
        date,
        amount,
        type,
      }: {
        date: string;
        amount: number;
        type: string;
      }) => {
        transactionTotal += type === "Income" ? amount : -amount; // Adjust balance
        if (cumulativeBalancesMap[date]) {
          cumulativeBalancesMap[date] = transactionTotal;
        } else {
          cumulativeBalancesMap[date] = transactionTotal;
        }
      }
    );

    const cumulativeBalances = Object.entries(cumulativeBalancesMap).map(
      ([date, balance]) => ({
        date,
        balance,
      })
    );

    // Ensure graph starts with correct initial balance
    cumulativeBalances.unshift({
      date: earliestDate,
      balance: startingBalance,
    });

    cumulativeBalances.push({
      date: endDate,
      balance: transactionTotal,
    });

    res.json(cumulativeBalances);
  } catch (err) {
    console.error("Error fetching account balances:", err);
    res.status(500).json({ error: "Failed to fetch account balances" });
  }
};

const getAccountTransactionTotalAfterBaseline = async ({
  userId,
  accountId,
  baselineDate,
}: {
  userId: string;
  accountId: string;
  baselineDate: string;
}) => {
  const transactions = await TransactionModel.find({
    userId,
    account: accountId,
    date: {
      $gte: baselineDate,
      $lte: new Date().toISOString().split("T")[0], //todays date in yyyy-mm-dd
    },
  });

  console.log(baselineDate);
  console.log(new Date().toISOString().split("T")[0]);
  const transactionTotal = transactions.reduce((total, transaction) => {
    return (
      total +
      (transaction.type === "Income" ? transaction.amount : -transaction.amount)
    );
  }, 0);
  return transactionTotal;
};

//Read
export const getAccounts = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Build the query object
    const query: any = { userId };
    let accounts = await AccountModel.find(query).sort({ date: -1, _id: -1 }); // Sort by date first, then by _id for uniqueness

    const includeBalance = req.query.includeBalance === "true";

    if (includeBalance) {
      accounts = await Promise.all(
        accounts.map(async (account) => {
          const transactionTotal =
            (await getAccountTransactionTotalAfterBaseline({
              userId,
              accountId: account._id,
              baselineDate: account.baselineDate,
            })) + account.baselineAmount;
          return {
            ...account.toObject(),
            balance: transactionTotal,
          };
        })
      );
    }

    res.json(accounts);
  } catch (err) {
    console.error("Error fetching accounts:", err);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
};

// Update
export const updateAccount = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const updateData = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const account = await AccountModel.findOne({ _id: id, userId });

    if (!account) {
      res
        .status(403)
        .json({ error: "You are not authorized to update this transaction" });
      return;
    }

    const updatedAccount = await AccountModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json(updatedAccount);
  } catch (err) {
    console.error("Error updating account:", err);
    res.status(500).json({ error: "Failed to update account" });
  }
};

// Delete
export const deleteAccount = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const account = await AccountModel.findOne({ _id: id, userId });

    if (!account) {
      res
        .status(403)
        .json({ error: "You are not authorized to delete this transaction" });
      return;
    }

    await AccountModel.findByIdAndDelete(id);

    res.json({ message: "Account eleted successfully" });
  } catch (err) {
    console.error("Error deleting account:", err);
    res.status(500).json({ error: "Failed to delete account" });
  }
};
