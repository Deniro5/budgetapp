import axios from "axios";
import AssetModel, { Asset } from "../models/asset.model";

const API_URL = "https://www.alphavantage.co/query";

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

export const assetService = {
  async create(data: Partial<Asset>) {
    return await AssetModel.create(data);
  },

  async findAll() {
    return await AssetModel.find();
  },

  async findById(id: string) {
    return await AssetModel.findById(id);
  },

  async update(id: string, data: Partial<Asset>) {
    return await AssetModel.findByIdAndUpdate(id, data, { new: true });
  },

  async updateBatch(ids: string[], data: Partial<Asset>) {
    return await AssetModel.findByIdAndUpdate(ids, data);
  },

  async remove(id: string) {
    return await AssetModel.findByIdAndDelete(id);
  },
  async updateAssetPriceHistory(asset: Asset) {
    const params = {
      function: "TIME_SERIES_DAILY",
      symbol: asset.symbol,
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
        `Alpha Vantage response for ${asset.symbol} was invalid`,
        data
      );
      return;
    }

    const updatedAsset = await AssetModel.findByIdAndUpdate(
      asset._id,
      {
        $set: {
          history: Object.entries(timeSeries).map(([date, daily]) => ({
            date,
            price: parseFloat(daily["4. close"]),
          })),
        },
      },
      { new: true }
    );

    return updatedAsset;
  },
};
// return investments;
// const now = Date.now();
// const investmentsWithHistory = [];

// for (const investment of investments) {
//   const symbol = investment.asset.symbol;
//   let history: any = await AssetPriceHistoryModel.findOne({ symbol });
//   const needsUpdate =
//     !history || now - new Date(history.lastUpdated).getTime() > ONE_DAY;

//   if (needsUpdate) {
//     const params = {
//       function: "TIME_SERIES_DAILY",
//       symbol,
//       apikey: process.env.AV_KEY as string,
//       outputsize: "compact",
//     };

//     const { data } = await axios.get<{
//       "Time Series (Daily)": TimeSeriesEntry;
//     }>(API_URL, {
//       params,
//     });

//     const timeSeries = data["Time Series (Daily)"];
//     if (!timeSeries) {
//       console.warn(`Alpha Vantage response for ${symbol} was invalid`, data);
//       continue;
//     }

//     history = Object.entries(timeSeries).map(([date, daily]) => ({
//       date,
//       price: parseFloat(daily["4. close"]),
//     }));

//     // Sort ascending
//     history.sort(
//       (a: any, b: any) =>
//         new Date(a.date).getTime() - new Date(b.date).getTime()
//     );

//     const res = [];
//     let index = 0;
//     let curr = history[0].date;
//     let end = history[history.length - 1].date;
//     let lastPrice = 0;

//     while (curr < end) {
//       const currentItem = history[index];
//       while (currentItem.date !== curr) {
//         res.push({
//           date: curr,
//           price: lastPrice,
//         });
//         curr = addOneDay(curr);
//       }
//       res.push({
//         date: curr,
//         price: currentItem.price,
//       });
//       lastPrice = currentItem.price;
//       curr = addOneDay(curr);
//       index++;
//     }

//     history = res;

//     await AssetPriceHistoryModel.findOneAndUpdate(
//       { symbol },
//       {
//         symbol,
//         history,
//         lastUpdated: new Date(),
//       },
//       { upsert: true, new: true }
//     );
//   } else {
//     //if we get history from mongo , we need to just take the history part not the symbol
//     history = history.history;
//   }

//   investmentsWithHistory.push({
//     ...investment,
//     asset: { ...investment.asset, history },
//   });
// }
// return investmentsWithHistory;
