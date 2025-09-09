import InvestmentModel from "../models/investment.model";
import mongoose from "mongoose";
import { addOneDay } from "../utils/dateutils";
import { updateAccountBalance } from "./accountService";
import { updateBatchAssetsByIds, updateAssetById } from "./assetService";

export const createInvestment = async (data: {
  userId: string;
  asset: string;
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
    accountId: account,
    change: -amount,
  });

  const now = new Date();
  await updateAssetById(data.asset, { lastUsed: now });

  return savedInvestment;
};

export const deleteInvestment = async (
  userId: string,
  id: string
): Promise<any> => {
  const investment = await InvestmentModel.findOne({ _id: id, userId });
  if (!investment) throw new Error("Unauthorized to delete this transaction");

  await InvestmentModel.findByIdAndDelete(id);

  const { quantity, price, account } = investment;

  await updateAccountBalance({
    accountId: account,
    change: quantity * price,
  });

  return investment;
};

export const getAllInvestments = async (userId: string) => {
  const investments = await InvestmentModel.find({ userId })
    .sort({ date: -1, _id: -1 })
    .populate({ path: "account", select: "name _id" })
    .populate({ path: "asset", select: "symbol name exchange history" });

  const now = new Date();
  updateBatchAssetsByIds(
    investments.map((i) => i.asset._id),
    { lastUsed: now }
  );

  return investments;
};

//used for getAllInvestments
export const getAggregatedInvestments = async (userId: string) => {
  const investments = await InvestmentModel.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "assets",
        localField: "asset",
        foreignField: "_id",
        as: "assetDetails",
      },
    },
    { $unwind: "$assetDetails" },
    {
      $group: {
        _id: {
          assetId: "$assetDetails._id",
          userId: "$userId",
        },
        symbol: { $first: "$assetDetails.symbol" },
        name: { $first: "$assetDetails.name" },
        exchange: { $first: "$assetDetails.exchange" },
        history: { $first: "$assetDetails.history" },
        totalQuantity: { $sum: "$quantity" },
        totalValue: { $sum: { $multiply: ["$quantity", "$price"] } },
      },
    },
    {
      $match: { totalQuantity: { $gt: 0 } },
    },
    {
      $project: {
        _id: 0,
        asset: {
          _id: "$_id.assetId",
          symbol: "$symbol",
          name: "$name",
          exchange: "$exchange",
          history: "$history",
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
      },
    },
    {
      $sort: { "asset.symbol": 1 },
    },
  ]);

  const now = new Date();
  const assetIds = investments.map((i) => i.asset._id);
  await updateBatchAssetsByIds(assetIds, { lastUsed: now });

  return investments;
};

//used for getAccountInvestmentSummary
export const getAggregatedInvestmentsByAccount = async (
  userId: string,
  accountId: string
) => {
  //gets total quantity and price for each asset
  const investments = await InvestmentModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        account: new mongoose.Types.ObjectId(accountId),
      },
    },

    {
      $lookup: {
        from: "assets",
        localField: "asset",
        foreignField: "_id",
        as: "assetDoc",
      },
    },
    { $unwind: "$assetDoc" },

    {
      $group: {
        _id: {
          assetId: "$assetDoc._id",
          userId: "$userId",
        },
        asset: { $first: "$assetDoc" },
        totalQuantity: { $sum: "$quantity" },
      },
    },

    { $match: { totalQuantity: { $gt: 0 } } },

    {
      $addFields: {
        price: { $ifNull: [{ $arrayElemAt: ["$asset.history.price", 0] }, 0] },
      },
    },
    {
      $project: {
        _id: 0,
        asset: {
          _id: "$asset._id",
          symbol: "$asset.symbol",
          name: "$asset.name",
          exchange: "$asset.exchange",
        },
        quantity: "$totalQuantity",
        price: 1,
      },
    },
    { $sort: { "asset.symbol": 1 } },
  ]);

  const now = new Date();
  const assetIds = investments.map((i) => i.asset._id);
  await updateBatchAssetsByIds(assetIds, { lastUsed: now });

  return investments;
};

export const getInvestmentTransactionHistoryByAccount = async ({
  userId,
  accountId,
  startDate,
  endDate,
}: {
  userId: string;
  accountId?: string;
  startDate: string;
  endDate: string;
}) => {
  const rawInvestmentTransactionTotalsByDate = await InvestmentModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        ...(accountId
          ? { account: new mongoose.Types.ObjectId(accountId) }
          : {}),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$date",
        totalValue: {
          $sum: {
            $multiply: ["$quantity", "$price"],
          },
        },
      },
    },
  ]);

  const investmentTransactionTotalsByDate =
    rawInvestmentTransactionTotalsByDate.reduce((acc, cur) => {
      acc[cur._id] = cur.totalValue;
      return acc;
    }, {});

  return investmentTransactionTotalsByDate;
};

export const getAggregatedInvestmentTimelineByAccount = async ({
  userId,
  accountId,
  startDate,
  endDate,
}: {
  userId: string;
  accountId?: string;
  startDate: string;
  endDate: string;
}) => {
  const investments = await InvestmentModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        ...(accountId
          ? { account: new mongoose.Types.ObjectId(accountId) }
          : {}),
      },
    },
    {
      $group: {
        _id: "$asset",
        assetId: { $first: "$asset" },
        entries: { $push: "$$ROOT" },
      },
    },
    {
      $lookup: {
        from: "assets",
        localField: "assetId",
        foreignField: "_id",
        as: "asset",
      },
    },
    { $unwind: "$asset" },
    {
      $project: {
        _id: 0,
        asset: {
          history: "$asset.history",
        },
        entries: 1,
      },
    },
  ]);

  const investmentTotalsByDate: Record<string, number> = {};

  investments.forEach((inv) => {
    const { history } = inv.asset;
    const { entries } = inv;
    const entriesKeyedByDate = entries.reduce(
      (
        acc: Record<string, number>,
        entry: { date: string; quantity: number }
      ) => {
        if (entry.date <= startDate) {
          acc[startDate] = (acc[startDate] || 0) + entry.quantity;
        } else {
          acc[entry.date] = (acc[entry.date] || 0) + entry.quantity;
        }

        return acc;
      },
      {}
    );

    const historyKeyedByDate = history.reduce((acc: any, entry: any) => {
      acc[entry.date] = entry;
      return acc;
    }, {});

    let cumulativeQty = 0;
    let currDate = startDate;
    let lastQuantity = 0;
    let lastPrice = 0;

    while (currDate <= endDate) {
      const entry = entriesKeyedByDate[currDate];
      if (entry) {
        cumulativeQty += entry;
        lastQuantity = cumulativeQty;
      }
      lastPrice = historyKeyedByDate[currDate]?.price || lastPrice;
      investmentTotalsByDate[currDate] =
        (investmentTotalsByDate[currDate] || 0) + cumulativeQty * lastPrice;

      currDate = addOneDay(currDate);
    }
  });

  return investmentTotalsByDate;
};
