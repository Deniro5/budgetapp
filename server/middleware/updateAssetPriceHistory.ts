import { Request, Response, NextFunction } from "express";
import axios from "axios";
import AssetPriceHistoryModel from "../models/assetpricehistory.model";

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

export const updateAssetPriceHistory = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const investments: Investment[] = req.investments as Investment[]; // assume populated earlier
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
          console.warn(
            `Alpha Vantage response for ${symbol} was invalid`,
            data
          );
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
    res.json(investmentsWithHistory);
    next();
  } catch (err) {
    console.error("Error in updateAssetPriceHistory", (err as Error).message);
    res.status(500).json({ error: "Failed to fetch asset price data" });
  }
};
