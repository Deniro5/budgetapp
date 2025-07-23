import AccountModel from "../models/account.model";
import TransactionModel from "../models/transaction.model";
import {
  getAggregatedInvestmentsByAccount,
  getAggregatedInvestmentTimelineByAccount,
} from "../services/investmentService";
import { addOneDay } from "../utils/dateutils";

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
      (await getAccountTransactionTotalAfterBaseline({
        userId,
        accountId,
        baselineDate: updateData.baselineDate,
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

export const getAccountBalanceAtDate = async ({
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
  if (startDate <= baselineDate) return 0;

  const transactions = await TransactionModel.find({
    userId,
    account: accountId,
    date: { $gte: baselineDate, $lt: startDate },
  });

  const delta = transactions.reduce((acc, cur) => {
    return acc + (cur.type === "Income" ? cur.amount : -cur.amount);
  }, 0);

  return baselineAmount + delta;
};

export const getAccountTransactionsFromStartToEnd = async ({
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
  const transactions = await TransactionModel.find({
    userId,
    account: accountId,
    date: { $gte: startDate, $lte: endDate },
  });

  if (startDate === baselineDate) {
    transactions.unshift({
      date: startDate,
      amount: baselineAmount,
      type: "Income",
    });
  }

  return transactions;
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
  let earliestDate: string | null = null;

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
    const laterStartDate = startDate < baselineDate ? baselineDate : startDate;

    if (!earliestDate || laterStartDate < earliestDate)
      earliestDate = laterStartDate;

    const transactionsFromStartToEnd =
      await getAccountTransactionsFromStartToEnd({
        userId,
        accountId: _id,
        startDate: laterStartDate,
        baselineDate,
        baselineAmount,
        endDate,
      });

    allTransactionsAfterStartDate.push(...transactionsFromStartToEnd);
  }

  const sortedTransactions = allTransactionsAfterStartDate.sort((a, b) =>
    a.date > b.date ? 1 : -1
  );

  const investmentBalances = await getAggregatedInvestmentTimelineByAccount({
    userId,
    accountId: id === "All" ? undefined : id,
    appendHistory: true,
  });

  const investmentBalancesMap = investmentBalances.reduce(
    (acc: Record<string, number>, cur: { date: string; value: number }) => {
      acc[cur.date] = cur.value;
      return acc;
    },
    {}
  );

  console.log(investmentBalancesMap);

  let currentDate = startDate;
  const result: {
    date: string;
    balance: number;
    value: number;
    total: number;
  }[] = [];

  sortedTransactions.forEach(({ date, amount, type }) => {
    while (date > currentDate) {
      result.push({
        date: currentDate,
        balance: transactionTotal,
        value: investmentBalancesMap[currentDate] || 0,
        total: transactionTotal + investmentBalancesMap[currentDate] || 0,
      });
      currentDate = addOneDay(currentDate);
    }
    transactionTotal += type === "Income" ? amount : -amount;
    result.push({
      date: currentDate,
      balance: transactionTotal,
      value: investmentBalancesMap[currentDate] || 0,
      total: transactionTotal + investmentBalancesMap[currentDate] || 0,
    });
  });

  return result;
};

export const getAccountTransactionTotalAfterBaseline = async ({
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
    date: { $gte: baselineDate, $lte: new Date().toISOString().split("T")[0] },
  });

  return transactions.reduce((total, transaction) => {
    return (
      total +
      (transaction.type === "Income" ? transaction.amount : -transaction.amount)
    );
  }, 0);
};

export const getAccountInvestmentTotalBaseline = async ({
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
    date: { $gte: baselineDate, $lte: new Date().toISOString().split("T")[0] },
  });

  return transactions.reduce((total, transaction) => {
    return (
      total +
      (transaction.type === "Income" ? transaction.amount : -transaction.amount)
    );
  }, 0);
};
