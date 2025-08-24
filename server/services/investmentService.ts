import InvestmentModel from "../models/investment.model";
import { SampleStocks } from "../data/sample-stocks";
import mongoose from "mongoose";
import AssetPriceHistoryModel from "../models/asset.model";
import axios from "axios";
import { addOneDay } from "../utils/dateutils";
import { updateAccountBalance } from "./accountService";
import { assetService } from "./assetService";

const API_URL = "https://www.alphavantage.co/query";
const ONE_DAY = 24 * 60 * 60 * 1000;

interface Investment {
  asset: {
    symbol: string;
  };
  entries: any[];
  quantity: number;
  price: number;
  date: string;
  account: string;
  userId: string;
}

interface TimeSeriesEntry {
  [date: string]: {
    "1. open": string;
    "2. high": string;
    "3. low": string;
    "4. close": string;
    "5. adjusted close": string;
    "6. volume": string;
    "7. dividend amount"?: string;
    "8. split coefficient"?: string;
  };
}

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
  await assetService.update(data.asset, { lastUsed: now });

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
  assetService.updateBatch(
    investments.map((i) => i.asset._id),
    { lastUsed: now }
  );

  return investments;
};

export const getAggregatedInvestments = async (userId: string) => {
  const investments = await InvestmentModel.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: {
          assetId: "$asset", // <-- get actual ObjectId here
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
          _id: "$_id.assetId", // <-- include _id so we can update lastUsed
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
    {
      $sort: { "asset.symbol": 1 },
    },
  ]);

  // --------------- update lastUsed ---------------
  const now = new Date();
  const assetIds = investments.map((i) => i.asset._id);
  await assetService.updateBatch(assetIds, { lastUsed: now });

  return investments;
};

export const getAggregatedInvestmentsByAccount = async (
  userId: string,
  accountId: string
) => {
  //get investments with a positive quantity by account id.
  //attach history to them
  //get the last price and return it with the investment
  const investments = await InvestmentModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        account: new mongoose.Types.ObjectId(accountId),
      },
    },
    {
      $group: {
        _id: {
          symbol: "$asset.symbol",
          userId: "$userId",
        },
        name: { $first: "$asset.name" },
        totalQuantity: { $sum: "$quantity" },
        totalValue: { $sum: { $multiply: ["$quantity", "$price"] } },
      },
    },
    { $match: { totalQuantity: { $gt: 0 } } },
    {
      $project: {
        _id: 0,
        asset: {
          symbol: "$_id.symbol",
          name: "$name",
        },
        quantity: "$totalQuantity",
      },
    },
    {
      $lookup: {
        from: "assetpricehistories",
        localField: "asset.symbol",
        foreignField: "symbol",
        as: "historyDoc",
      },
    },
    {
      $unwind: {
        path: "$historyDoc",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        price: {
          $arrayElemAt: ["$historyDoc.history.price", -1],
        },
      },
    },

    {
      $project: {
        asset: 1,
        quantity: 1,
        price: 1,
      },
    },

    { $sort: { "asset.symbol": 1 } },
  ]);

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
        _id: "$date", // key directly by date
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

export const searchStocks = (query: string) => {
  const lower = query.toLowerCase();
  return SampleStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(lower) ||
      stock.name.toLowerCase().includes(lower)
  ).slice(0, 20);
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
  //Final structure: {date: string, value: number}[] where value is the total value of all investments on that day
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
        _id: {
          symbol: "$asset.symbol",
          userId: "$userId",
        },
        symbol: { $first: "$asset.symbol" },
        entries: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        asset: {
          symbol: "$_id.symbol",
        },
        entries: 1,
      },
    },
  ]);
  const investmentsWithHistory = await updateAssetPriceHistory(investments);

  const investmentTotalsByDate: Record<string, number> = {};

  //we need to sort the entries
  investmentsWithHistory.forEach((inv) => {
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
