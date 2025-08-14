import RecurringTransactionModel from "../models/recurringtransaction.model";
import {
  addOneDay,
  addOneMonth,
  addOneWeek,
  addTwoWeeks,
  getTodayDate,
} from "../utils/dateutils";
import { createTransaction } from "./transactionService";

interface RecurringTransactionInput {
  name: string;
  description?: string;
  amount: number;
  type: string;
  date?: Date;
  account?: string;
  category?: string;
  vendor?: string;
  tags?: string[];
  userId: string;
  interval: string;
  nextRunDate: string;
}

export const createRecurringTransaction = async (
  input: RecurringTransactionInput
) => {
  const transactionCount = await RecurringTransactionModel.countDocuments({
    userId: input.userId,
  });

  if (transactionCount >= 100) {
    throw new Error(
      "Recurring Transaction limit reached (100). Please delete an existing recurring transaction and try again"
    );
  }

  const newTransaction = new RecurringTransactionModel(input);
  return newTransaction.save();
};

export const getRecurringTransactionById = async (
  id: string,
  userId: string
) => {
  return RecurringTransactionModel.findOne({ _id: id, userId });
};

interface RecurringTransactionQuery {
  userId: string;
  q?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  category?: string;
  tags?: string | string[];
  type?: string;
  minAmount?: number;
  maxAmount?: number;
  account?: string | string[];
}

export const getRecurringTransactions = async (
  query: RecurringTransactionQuery
) => {
  const {
    userId,
    q,
    limit = 100,
    offset = 0,
    sort = "-createdAt",
    category,
    tags,
    type,
    minAmount,
    maxAmount,
    account,
  } = query;

  const dbQuery: any = { userId };

  if (q) {
    dbQuery.$or = [
      { name: { $regex: q, $options: "i" } },
      { vendor: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  if (category) dbQuery.category = category;

  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    dbQuery.tags = { $in: tagArray };
  }

  if (type) dbQuery.type = type;

  if (minAmount !== undefined || maxAmount !== undefined) {
    dbQuery.amount = {};
    if (minAmount !== undefined) dbQuery.amount.$gte = minAmount;
    if (maxAmount !== undefined) dbQuery.amount.$lte = maxAmount;
  }

  if (account) {
    const accountArray = Array.isArray(account) ? account : [account];
    dbQuery.account = { $in: accountArray };
  }

  const count = await RecurringTransactionModel.countDocuments(dbQuery);

  const transactions = await RecurringTransactionModel.find(dbQuery)
    .sort(sort)
    .skip(offset)
    .limit(limit)
    .populate({ path: "account", select: "name _id" });

  return { transactions, count };
};

export const updateRecurringTransaction = async (
  id: string,
  userId: string,
  updateData: Partial<RecurringTransactionInput>
) => {
  // Check ownership
  const transaction = await RecurringTransactionModel.findOne({
    _id: id,
    userId,
  });
  if (!transaction) return null;

  console.log(updateData);

  return RecurringTransactionModel.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate({ path: "account", select: "name _id" });
};

export const deleteRecurringTransaction = async (
  id: string,
  userId: string
) => {
  // Check ownership
  const transaction = await RecurringTransactionModel.findOne({
    _id: id,
    userId,
  });
  if (!transaction) return false;

  await RecurringTransactionModel.findByIdAndDelete(id);
  return true;
};

const getNextRunDate = (interval: string, date: string) => {
  switch (interval) {
    case "daily":
      return addOneDay(date);
    case "weekly":
      return addOneWeek(date);
    case "bi-weekly":
      return addTwoWeeks(date);
    case "monthly":
      return addOneMonth(date);
    default:
      return date;
  }
};

export const processRecurringTransactions = async () => {
  const transactions = await RecurringTransactionModel.find();
  const currentDate = getTodayDate();
  transactions.forEach(async (transaction) => {
    //if the transaction date is less than or equal to the current date
    let nextDate = transaction.date;
    let shouldUpdate = false;
    //loop through until the next date is greater than the current date. This will allow us to create multiple transactions if we need to
    while (nextDate <= currentDate) {
      createTransaction({
        userId: transaction.userId,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        date: nextDate,
        account: transaction.account,
        category: transaction.category,
        vendor: transaction.vendor,
        tags: transaction.tags,
      });
      nextDate = getNextRunDate(transaction.interval, nextDate);
      shouldUpdate = true;
    }
    if (shouldUpdate) {
      updateRecurringTransaction(transaction._id, transaction.userId, {
        date: nextDate,
      });
    }
  }); //
  return { transactions };
};
