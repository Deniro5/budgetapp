import mongoose from "mongoose";

export interface Asset extends Document {
  _id: string;
  symbol: string;
  name: string;
  exchange: string;
  priceHistory: { date: string; price: number }[];
  lastUsed: Date;
}

const AssetSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  symbol: { type: String, required: true, unique: true },
  exchange: { type: String, required: true },
  history: [
    {
      date: { type: String },
      price: { type: Number },
    },
  ],
  lastUsed: { type: Date, required: true },
});

const AssetModel = mongoose.model("Asset", AssetSchema);

export default AssetModel;
