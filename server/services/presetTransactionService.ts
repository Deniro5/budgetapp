import PresetTransactionModel from "../models/presettransaction.model";

interface PresetTransactionInput {
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
}

export const createPresetTransaction = async (
  input: PresetTransactionInput
) => {
  const transactionCount = await PresetTransactionModel.countDocuments({
    userId: input.userId,
  });

  if (transactionCount >= 100) {
    throw new Error(
      "Preset Transaction limit reached (100). Please delete an existing preset transaction and try again"
    );
  }

  const newTransaction = new PresetTransactionModel(input);
  return newTransaction.save();
};

export const getPresetTransactionById = async (id: string, userId: string) => {
  return PresetTransactionModel.findOne({ _id: id, userId });
};

interface PresetTransactionQuery {
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

export const getPresetTransactions = async (query: PresetTransactionQuery) => {
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

  const count = await PresetTransactionModel.countDocuments(dbQuery);

  const transactions = await PresetTransactionModel.find(dbQuery)
    .sort(sort)
    .skip(offset)
    .limit(limit)
    .populate({ path: "account", select: "name _id" });

  return { transactions, count };
};

export const updatePresetTransaction = async (
  id: string,
  userId: string,
  updateData: Partial<PresetTransactionInput>
) => {
  // Check ownership
  const transaction = await PresetTransactionModel.findOne({ _id: id, userId });
  if (!transaction) return null;

  return PresetTransactionModel.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate({ path: "account", select: "name _id" });
};

export const deletePresetTransaction = async (id: string, userId: string) => {
  // Check ownership
  const transaction = await PresetTransactionModel.findOne({ _id: id, userId });
  if (!transaction) return false;

  await PresetTransactionModel.findByIdAndDelete(id);
  return true;
};
