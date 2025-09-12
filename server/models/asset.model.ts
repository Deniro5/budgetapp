import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IAsset extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  symbol: string;
  name: string;
  exchange: string;
  history: { date: string; price: number }[];
  lastUsed: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema: Schema<IAsset> = new Schema(
  {
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
  },
  { timestamps: true }
);

const AssetModel: Model<IAsset> = mongoose.model<IAsset>("Asset", AssetSchema);

export default AssetModel;
