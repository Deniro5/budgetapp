import { all } from "axios";
import AccountModel from "../models/account.model";
import TransactionModel from "../models/transaction.model";
import {
  getAggregatedInvestmentsByAccount,
  getAggregatedInvestmentTimelineByAccount,
  getInvestmentTransactionHistoryByAccount,
} from "../services/investmentService";
import { addOneDay } from "../utils/dateutils";
import InvestmentModel from "../models/investment.model";
import e from "express";

interface AccountInput {
  userId: string;
  name: string;
  institution?: string;
  baselineAmount: number;
  baselineDate: string;
  type: string;
}

export const createAccount = async (input: AccountInput) => {
  const accountCount = await AccountModel.countDocuments({
    userId: input.userId,
  });
  if (accountCount >= 50) {
    throw new Error(
      "Account limit reached (50). Please delete an existing account and try again"
    );
  }

  const newAccount = new AccountModel({
    userId: input.userId,
    name: input.name,
    institution: input.institution,
    baselineAmount: input.baselineAmount,
    baselineDate: input.baselineDate,
    type: input.type,
    balance: input.baselineAmount,
  });

  return newAccount.save();
};

export const getAccountById = async (userId: string, accountId: string) => {
  return AccountModel.findOne({ _id: accountId, userId });
};

export const getAccountInvestmentSummary = async ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => await getAggregatedInvestmentsByAccount(userId, accountId);

export const getAllAccounts = async (userId: string) => {
  return AccountModel.find({ userId }).sort({ date: -1, _id: -1 });
};

export const getAllAccountsWithInvestmentSummary = async (userId: string) => {
  const accounts = await getAllAccounts(userId);

  const accountsWithInvestments = await Promise.all(
    accounts.map(async (account) => {
      const investmentSummary = await getAggregatedInvestmentsByAccount(
        userId,
        account._id.toString()
      );
      return {
        ...account.toObject(),
        investmentSummary,
      };
    })
  );
  return accountsWithInvestments;
};

export const updateAccount = async (
  userId: string,
  accountId: string,
  updateData: any
) => {
  const account = await AccountModel.findOne({ _id: accountId, userId });
  if (!account) return null;

  if (
    updateData.baselineAmount !== account.baselineAmount &&
    updateData.baselineDate === account.baselineDate
  ) {
    updateData.balance += updateData.baselineAmount - account.baselineAmount;
  }

  if (updateData.baselineDate !== account.baselineDate) {
    const transactionTotal =
      (await getAccountTransactionTotalBetweenDates({
        userId,
        accountId,
        startDate: updateData.baselineDate,
        endDate: new Date().toISOString().split("T")[0],
      })) + updateData.baselineAmount;
    updateData.balance = transactionTotal;
  }

  return AccountModel.findByIdAndUpdate(accountId, updateData, { new: true });
};

export const deleteAccount = async (userId: string, accountId: string) => {
  const account = await AccountModel.findOne({ _id: accountId, userId });
  if (!account) return null;

  await AccountModel.findByIdAndDelete(accountId);
  return true;
};

export const getAccountTransactionsFromStartToEnd = async ({
  userId,
  accountId,
  startDate,
  baselineAmount,
  endDate,
}: {
  userId: string;
  accountId: string;
  startDate: string;
  baselineAmount: number;
  endDate: string;
}): Promise<any[]> => {
  const transactions = await TransactionModel.find({
    userId,
    account: accountId,
    date: { $gte: startDate, $lte: endDate },
  });

  transactions.unshift({
    date: startDate,
    amount: baselineAmount,
    type: "Income",
  });

  return transactions;
};

export const getAccountTransactionTotalBetweenDates = async ({
  userId,
  accountId,
  startDate,
  endDate,
}: {
  userId: string;
  accountId: string;
  startDate: string;
  endDate: string;
}) => {
  const transactionHistory = await TransactionModel.find({
    userId,
    account: accountId,
    date: { $gte: startDate, $lte: endDate },
  });
  const transactionTotal = transactionHistory.reduce((total, transaction) => {
    return (
      total +
      (transaction.type === "Income" ? transaction.amount : -transaction.amount)
    );
  }, 0);
  const investmentTransactionHistory: Record<string, number> =
    await getInvestmentTransactionHistoryByAccount({
      userId,
      accountId: accountId,
      startDate,
      endDate,
    });

  const investmentTransactionTotal: number = Object.values(
    investmentTransactionHistory
  ).reduce((acc: number, cur: number) => {
    return acc - cur;
  }, 0);

  return transactionTotal + investmentTransactionTotal;
};

export const getAccountBalancesById = async ({
  userId,
  id,
  startDate,
  endDate,
}: {
  userId: string;
  id: string;
  startDate: string;
  endDate: string;
}) => {
  const accounts = [];
  if (id === "All") {
    const allAccounts = await AccountModel.find({ userId });
    accounts.push(...allAccounts);
  } else {
    const account = await AccountModel.findOne({ _id: id, userId });
    if (!account) throw new Error("Account not found or unauthorized");
    accounts.push(account);
  }

  let transactionTotal = 0;
  let allTransactionsAfterStartDate: any[] = [];

  for (const account of accounts) {
    const { _id, baselineAmount, baselineDate } = account;
    const accountBalanceAtStartDate =
      await getAccountTransactionTotalBetweenDates({
        userId,
        accountId: _id,
        startDate: baselineDate,
        endDate: startDate,
      });
    transactionTotal += accountBalanceAtStartDate;
    //we need to start from the next day since we have already included transactions up to the start date
    const laterStartDate =
      startDate < baselineDate ? baselineDate : addOneDay(startDate);

    const transactionsFromStartToEnd =
      await getAccountTransactionsFromStartToEnd({
        userId,
        accountId: _id,
        startDate: laterStartDate,
        baselineAmount,
        endDate,
      });

    allTransactionsAfterStartDate.push(...transactionsFromStartToEnd);
  }

  //use reduce to get a map from date to transaction total on that date
  const transactionBalancesByDate = allTransactionsAfterStartDate.reduce(
    (acc, curr) => {
      const { date, amount, type } = curr;
      if (!acc[date]) acc[date] = 0;
      acc[date] += type === "Income" ? amount : -amount;
      return acc;
    },
    {}
  );

  let currentDate = addOneDay(startDate);

  const investmentBalancesMap = await getAggregatedInvestmentTimelineByAccount({
    userId,
    accountId: id === "All" ? undefined : id,
    startDate: currentDate,
    endDate,
  });

  const investmentTransactionHistoryByAccount =
    await getInvestmentTransactionHistoryByAccount({
      userId,
      accountId: id === "All" ? undefined : id,
      startDate: currentDate,
      endDate,
    });

  const result: {
    date: string;
    balance: number;
    value: number;
    total: number;
  }[] = [];

  while (currentDate <= endDate) {
    transactionTotal +=
      (transactionBalancesByDate[currentDate] || 0) -
      (investmentTransactionHistoryByAccount[currentDate] || 0);
    result.push({
      date: currentDate,
      balance: transactionTotal,
      value: investmentBalancesMap[currentDate] || 0,
      total: transactionTotal + (investmentBalancesMap[currentDate] || 0),
    });
    currentDate = addOneDay(currentDate);
  }
  return result;
};

interface UpdateAccountBalanceArgs {
  accountId: string;
  change: number;
}

export const updateAccountBalance = async ({
  accountId,
  change,
}: UpdateAccountBalanceArgs): Promise<void> => {
  await AccountModel.findByIdAndUpdate(
    accountId,
    { $inc: { balance: change } },
    { new: true }
  );
};
