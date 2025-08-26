import axios from "axios";
import AssetModel, { Asset } from "../models/asset.model";
import JobRunModel from "../models/job.model";
import { SampleStocks } from "../data/sample-stocks";

const API_URL = "https://www.alphavantage.co/query";
const UPDATE_ASSETS_JOB_NAME = "updateAssets";

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

export async function createAsset(data: Partial<Asset>) {
  return await AssetModel.create(data);
}

export async function getAssets() {
  return await AssetModel.find();
}

export async function getAssetById(id: string) {
  return await AssetModel.findById(id);
}

export async function updateAssetById(id: string, data: Partial<Asset>) {
  console.log(data);
  console.log(id);
  return await AssetModel.findByIdAndUpdate(id, data, { new: true });
}

export async function updateBatchAssetsByIds(
  ids: string[],
  data: Partial<Asset>
) {
  return await AssetModel.updateMany({ _id: { $in: ids } }, { $set: data });
}
export async function deleteAssetById(id: string) {
  return await AssetModel.findByIdAndDelete(id);
}

export async function updateAssetPriceHistory(asset: any) {
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
}

export async function updateLastUsedAssetsPrices() {
  const job = await JobRunModel.findOne({ name: UPDATE_ASSETS_JOB_NAME });
  const today = new Date();
  today.setHours(0, 0, 0, 0); // start of today

  if (job && job.lastRun >= today) {
    console.log("Already updated assets today");
    return;
  }

  const assetsToUpdate = await AssetModel.find()
    .sort({ lastUsed: -1 }) // -1 = descending
    .limit(25);

  for (let i = 0; i < assetsToUpdate.length; i++) {
    const asset = assetsToUpdate[i];
    try {
      await updateAssetPriceHistory(asset);
      console.log("updated asset", asset.symbol);
    } catch (err) {
      console.error("Failed to update asset", asset.symbol, err);
    }
    await new Promise((resolve) => setTimeout(resolve, 15000)); // stagger requests
  }

  // Record the run
  if (job) {
    job.lastRun = new Date();
    await job.save();
  } else {
    await JobRunModel.create({
      name: UPDATE_ASSETS_JOB_NAME,
      lastRun: new Date(),
    });
  }

  console.log("update assets completed");
  return assetsToUpdate;
}

export const searchAsset = (query: string) => {
  const lower = query.toLowerCase();
  return SampleStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(lower) ||
      stock.name.toLowerCase().includes(lower)
  ).slice(0, 20);
};
