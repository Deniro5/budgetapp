import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IJobRun extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  name: string;
  lastRun: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobRunSchema: Schema<IJobRun> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    lastRun: { type: Date, required: true },
  },
  { timestamps: true }
);

const JobRunModel: Model<IJobRun> = mongoose.model<IJobRun>(
  "JobRun",
  JobRunSchema
);

export default JobRunModel;
