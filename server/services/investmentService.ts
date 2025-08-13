import InvestmentModel from "../models/investment.model";
import { SampleStocks } from "../data/sample-stocks";
import mongoose from "mongoose";
import AccountModel from "../models/account.model";
import AssetPriceHistoryModel from "../models/assetpricehistory.model";
import axios from "axios";
import { addOneDay, getTodayDate } from "../utils/dateutils";
import { start } from "repl";

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

interface CustomRequest extends Request {
  investments?: Investment[];
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

export const getAggregatedInvestments = async (
  userId: string,
  appendHistory?: boolean
) => {
  const investments = await InvestmentModel.aggregate([
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
    {
      $sort: { "asset.symbol": 1 },
    },
  ]);
  return appendHistory ? updateAssetPriceHistory(investments) : investments;
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

export const updateAssetPriceHistory = async (investments: Investment[]) => {
  const now = Date.now();
  const investmentsWithHistory = [];

  for (const investment of investments) {
    const symbol = investment.asset.symbol;
    let history: any = await AssetPriceHistoryModel.findOne({ symbol });
    const needsUpdate =
      !history || now - new Date(history.lastUpdated).getTime() > ONE_DAY;

    if (needsUpdate) {
      const params = {
        function: "TIME_SERIES_DAILY",
        symbol,
        apikey: process.env.AV_KEY as string,
        outputsize: "compact",
      };

      const { data } = await axios.get<{
        "Time Series (Daily)": TimeSeriesEntry;
      }>(API_URL, {
        params,
      });

      const timeSeries = data["Time Series (Daily)"];
      if (!timeSeries) {
        console.warn(`Alpha Vantage response for ${symbol} was invalid`, data);
        continue;
      }

      history = Object.entries(timeSeries).map(([date, daily]) => ({
        date,
        price: parseFloat(daily["4. close"]),
      }));

      // Sort ascending
      history.sort(
        (a: any, b: any) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const res = [];
      let index = 0;
      let curr = history[0].date;
      let end = history[history.length - 1].date;
      let lastPrice = 0;

      while (curr < end) {
        const currentItem = history[index];
        while (currentItem.date !== curr) {
          res.push({
            date: curr,
            price: lastPrice,
          });
          curr = addOneDay(curr);
        }
        res.push({
          date: curr,
          price: currentItem.price,
        });
        lastPrice = currentItem.price;
        curr = addOneDay(curr);
        index++;
      }

      history = res;

      await AssetPriceHistoryModel.findOneAndUpdate(
        { symbol },
        {
          symbol,
          history,
          lastUpdated: new Date(),
        },
        { upsert: true, new: true }
      );
    } else {
      //if we get history from mongo , we need to just take the history part not the symbol
      history = history.history;
    }

    investmentsWithHistory.push({
      ...investment,
      asset: { ...investment.asset, history },
    });
  }
  return investmentsWithHistory;
};
