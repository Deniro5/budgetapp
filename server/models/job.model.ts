import mongoose from "mongoose";

interface JobRun extends Document {
  name: string;
  lastRun: Date;
}

const JobRunSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  lastRun: { type: Date, required: true },
});

const JobRunModel = mongoose.model<JobRun>("JobRun", JobRunSchema);

export default JobRunModel;
