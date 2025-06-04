import { Request, Response } from "express";
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

    const { name, institution, amount, type } = req.body;

    const newAccount = new AccountModel({
      userId,
      name,
      institution,
      amount,
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

export const getAccountBalancesById = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const { startDate, endDate } = req.query; // Expected as YYYY-MM-DD

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

    if (id === "All") {
      const accounts = await AccountModel.find({ userId });
      let transactionTotal = 0;
      const allTransactions: { date: string; amount: number }[] = [];

      for (const account of accounts) {
        const { _id, baselineAmount, baselineDate } = account;

        // Skip accounts where endDate is before baseline
        if (endDate < baselineDate) continue;

        let runningTotal = baselineAmount;

        if (startDate > baselineDate) {
          const baselineToStartQuery: any = {
            userId,
            account: _id,
            date: {
              $gte: baselineDate,
              $lt: startDate,
            },
          };

          const transactions = await TransactionModel.find(
            baselineToStartQuery
          );

          const delta = transactions.reduce((acc, cur) => {
            return acc + (cur.type === "Income" ? cur.amount : -cur.amount);
          }, 0);

          runningTotal += delta;
        }
        transactionTotal += runningTotal;

        const laterStart = startDate < baselineDate ? baselineDate : startDate;

        const transactionsBetweenStartAndEnd = await TransactionModel.find({
          userId,
          account: _id,
          date: {
            $gte: laterStart,
            $lte: endDate,
          },
        });

        console.log(transactionsBetweenStartAndEnd);

        transactionsBetweenStartAndEnd.forEach((transaction) => {
          const amount =
            transaction.type === "Income"
              ? transaction.amount
              : -transaction.amount;
          allTransactions.push({ date: transaction.date, amount });
        });
      }
    }

    //get the baseline amount. If its One account just get the account. if its "All" then we need to take an aggregate
    const account = await AccountModel.findOne({ _id: id, userId });
    const baselineDate = account.baselineDate;

    //if endDate is earlier than account.baselineDate then we cant show any data
    if (endDate < baselineDate) {
      res.json([]);
      return;
    }

    //sum transactions from baselinedate to start date to get correct starting amount
    let transactionTotalFromBaselineToStart = account.baselineAmount;
    if (startDate > baselineDate) {
      const baselineToStartquery: any = { userId };
      baselineToStartquery.account = id === "All" ? undefined : id;
      baselineToStartquery.date = {};
      baselineToStartquery.date.$gte = baselineDate;
      baselineToStartquery.date.$lt = startDate;

      //TODO get this working with aggregate
      const transactionsAfterBaselineBeforeStart = await TransactionModel.find(
        baselineToStartquery
      ).sort({
        date: -1,
        _id: -1,
      });

      transactionTotalFromBaselineToStart +=
        transactionsAfterBaselineBeforeStart.reduce(
          (acc, cur) =>
            acc + (cur.type === "Income" ? cur.amount : -cur.amount),
          0
        );
    }

    const laterStartDate = startDate < baselineDate ? baselineDate : startDate;

    const laterStartToEndQuery: any = { userId };
    laterStartToEndQuery.account = id === "All" ? undefined : id;
    laterStartToEndQuery.date = {};
    laterStartToEndQuery.date.$gte = laterStartDate;
    laterStartToEndQuery.date.$lte = endDate;

    const transactionsFromLatestStartDateToEndDate =
      await TransactionModel.find(laterStartToEndQuery).sort({
        date: 1,
        _id: -1,
      }); // Sort by date first, then by _id for uniqueness

    if (!transactionsFromLatestStartDateToEndDate.length) {
      res.json([]);
      return;
    }

    let runningBalance = transactionTotalFromBaselineToStart;
    const cumulativeBalances: { date: any; balance: number }[] = [];

    transactionsFromLatestStartDateToEndDate.forEach(
      ({ date, amount, type }: any) => {
        runningBalance += type === "Income" ? amount : -amount; // Adjust balance
        cumulativeBalances.push({ date, balance: runningBalance });
      }
    );

    // Ensure graph starts with correct initial balance
    cumulativeBalances.unshift({
      date: start,
      balance: transactionTotalFromBaselineToStart,
    });

    res.json(cumulativeBalances);
  } catch (err) {
    console.error("Error fetching account balances:", err);
    res.status(500).json({ error: "Failed to fetch account balances" });
  }
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

    const accounts = await AccountModel.find(query).sort({ date: -1, _id: -1 }); // Sort by date first, then by _id for uniqueness

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
