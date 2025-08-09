import InvestmentModel from "../models/investment.model";
import { SampleStocks } from "../data/sample-stocks";
import mongoose from "mongoose";
import AccountModel from "../models/account.model";
import AssetPriceHistoryModel from "../models/assetpricehistory.model";
import axios from "axios";
import { addOneDay, getTodayDate } from "../utils/dateutils";

const API_URL = "https://www.alphavantage.co/query";
const ONE_DAY = 24 * 60 * 60 * 1000;

interface Investment {
  asset: {
    symbol: string;
  };
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
  accountId: string,
  appendHistory?: boolean
) => {
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
        exchange: { $first: "$asset.exchange" },
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
          exchange: "$exchange",
        },
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
  return appendHistory ? updateAssetPriceHistory(investments) : investments;
};
export const getAggregatedInvestmentTimelineByAccount = async ({
  userId,
  accountId,
  appendHistory,
  startDate,
  endDate,
}: {
  userId: string;
  accountId?: string;
  appendHistory?: boolean;
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
        entries: 1,
      },
    },
    {
      $sort: { "asset.symbol": 1 },
    },
  ]);
  const investmentsWithHistory = appendHistory
    ? await updateAssetPriceHistory(investments)
    : investments;

  const test = investmentsWithHistory.map((inv) => {
    const { history } = inv.asset;
    const { entries } = inv;
    // Sort entries and history to ensure they're chronological
    const sortedEntries = [...entries].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    const sortedHistory = [...history].sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    const today = getTodayDate();

    if (
      sortedHistory.length > 0 &&
      sortedHistory[sortedHistory.length - 1].date !== today
    ) {
      sortedHistory.push({
        date: today,
        price: sortedHistory[sortedHistory.length - 1].price,
      });
    }

    console.log(sortedHistory);
    let cumulativeQty = 0;
    let entryIndex = 0;

    const dailyValue = sortedHistory.map(({ date, price }) => {
      // Accumulate quantity from entries up to and including this date
      while (
        entryIndex < sortedEntries.length &&
        sortedEntries[entryIndex].date <= date
      ) {
        cumulativeQty += sortedEntries[entryIndex].quantity; // buy = positive, sell = negative
        entryIndex++;
      }

      const value = cumulativeQty * price;

      return {
        date,
        value,
      };
    });

    return dailyValue;
  });

  //if there are no investments, or the date is out of the range of the data
  if (
    test.length === 0 ||
    endDate < test[0][0].date ||
    startDate > test[0][test[0].length - 1].date
  )
    return [];

  let result = [];
  let lastValue = 0;
  let currDate = startDate;
  //go through every date and get the current value. There are gaps on the weekends so we have to manually fill them with the last known value.
  while (currDate <= endDate) {
    let total = 0;
    //find a date in the test that matches the start date
    const index = test[0].findIndex((item) => item.date === currDate);

    if (index < 0) {
      //if theres no date found just use the last value
      result.push({ date: currDate, value: lastValue });
    } else {
      //add up all the investments for that day
      for (let i = 0; i < test.length; i++) {
        total += test[i][index].value;
      }
      result.push({ date: currDate, value: total });
      lastValue = total;
    }
    currDate = addOneDay(currDate);
  }
  return result;
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
