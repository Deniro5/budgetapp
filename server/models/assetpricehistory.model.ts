import mongoose from "mongoose";

const AssetPriceHistorySchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  history: [
    {
      date: { type: String },
      price: { type: Number },
    },
  ],
  lastUpdated: { type: Date, required: true },
});

const AssetPriceHistoryModel = mongoose.model(
  "AssetPriceHistory",
  AssetPriceHistorySchema
);

export default AssetPriceHistoryModel;
