import { Request, Response } from "express";
import * as accountService from "../services/accountService";

interface CustomRequest extends Request {
  userId?: string;
}

export const createAccount = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const newAccount = await accountService.createAccount({
      userId,
      ...req.body,
    });

    res.status(201).json(newAccount);
  } catch (err: any) {
    if (err.message.includes("Account limit reached")) {
      res.status(400).json({ error: err.message });
      return;
    }
    console.error("Error creating account:", err);
    res.status(500).json({ error: "Failed to create account" });
  }
};

export const getAccountById = async (
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

    const account = await accountService.getAccountById(userId, id);

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

export const getAccounts = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const accounts = await accountService.getAllAccountsWithInvestmentSummary(
      userId
    );

    res.json(accounts);
  } catch (err) {
    console.error("Error fetching accounts:", err);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
};

export const getAccountBalancesById = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!startDate || !endDate) {
      res.status(400).json({ error: "Missing start / end date" });
      return;
    }
    if (typeof startDate !== "string" || typeof endDate !== "string") {
      res.status(400).json({ error: "Invalid date types" });
      return;
    }
    if (endDate < startDate) {
      res.status(400).json({ error: "Start date must be before end date" });
      return;
    }

    const balances = await accountService.getAccountBalancesById({
      userId,
      id,
      startDate,
      endDate,
    });

    res.json(balances);
  } catch (err) {
    console.error("Error fetching account balances:", err);
    res.status(500).json({ error: "Failed to fetch account balances" });
  }
};

export const updateAccount = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const updateData = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const updatedAccount = await accountService.updateAccount(
      userId,
      id,
      updateData
    );

    if (!updatedAccount) {
      res
        .status(403)
        .json({ error: "You are not authorized to update this account" });
      return;
    }

    res.json(updatedAccount);
  } catch (err) {
    console.error("Error updating account:", err);
    res.status(500).json({ error: "Failed to update account" });
  }
};

export const deleteAccount = async (
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

    const deleted = await accountService.deleteAccount(userId, id);

    if (!deleted) {
      res
        .status(403)
        .json({ error: "You are not authorized to delete this account" });
      return;
    }

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Error deleting account:", err);
    res.status(500).json({ error: "Failed to delete account" });
  }
};
