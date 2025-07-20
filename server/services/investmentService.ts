import InvestmentModel from "../models/investment.model";
import { SampleStocks } from "../data/sample-stocks";
import mongoose from "mongoose";
import AccountModel from "../models/account.model";

interface UpdateAccountBalanceArgs {
  userId: string;
  accountId: string;
  change: number;
}

const updateAccountBalance = async ({
  userId,
  accountId,
  change,
}: UpdateAccountBalanceArgs): Promise<void> => {
  const account = await AccountModel.findOne({ _id: accountId, userId });
  if (!account) throw new Error("Account not found");

  const updateData = {
    ...account.toObject(),
    balance: account.balance + Number(change),
  };

  await AccountModel.findByIdAndUpdate(accountId, updateData, { new: true });
};

export const createInvestment = async (data: {
  userId: string;
  asset: any;
  account: string;
  date: Date;
  quantity: number;
  price: number;
}) => {
  const investment = new InvestmentModel(data);
  const savedInvestment = await investment.save();

  const { userId, account, quantity, price } = data;
  const amount = quantity * price;

  await updateAccountBalance({
    userId,
    accountId: account,
    change: -amount,
  });

  return savedInvestment;
};

export const getAllInvestments = async (userId: string) => {
  return await InvestmentModel.find({ userId }).sort({ date: -1, _id: -1 });
};

export const getAggregatedInvestments = async (userId: string) => {
  return await InvestmentModel.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: {
          symbol: "$asset.symbol",
          userId: "$userId",
        },
        name: { $first: "$asset.name" },
        exchange: { $first: "$asset.exchange" },
        totalQuantity: { $sum: "$quantity" },
        totalValue: { $sum: { $multiply: ["$quantity", "$price"] } },
        entries: { $push: "$$ROOT" },
      },
    },
    { $match: { totalQuantity: { $gt: 0 } } },
    {
      $project: {
        _id: 0,
        asset: {
          symbol: "$_id.symbol",
          name: "$name",
          exchange: "$exchange",
        },
        userId: "$_id.userId",
        quantity: "$totalQuantity",
        price: {
          $cond: [
            { $eq: ["$totalQuantity", 0] },
            0,
            { $divide: ["$totalValue", "$totalQuantity"] },
          ],
        },
        entries: 1,
      },
    },
  ]);
};

export const searchStocks = (query: string) => {
  const lower = query.toLowerCase();
  return SampleStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(lower) ||
      stock.name.toLowerCase().includes(lower)
  ).slice(0, 20);
};
