import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import transactionRoutes from "./routes/transaction.routes";
import presetTransactionRoutes from "./routes/presettransaction.routes";
import accountRoutes from "./routes/account.routes";
import recurringTransactionRoutes from "./routes/recurringtransaction.routes";
import budgetRoutes from "./routes/budget.routes";
import transferRoutes from "./routes/transfer.routes";
import investmentRoutes from "./routes/investment.routes";
import { processRecurringTransactions } from "./services/recurringTransactionService";
import { updateLastUsedAssetsPrices } from "./services/assetService";
import assetRoutes from "./routes/asset.routes";

const app = express();

dotenv.config();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/transfers", transferRoutes);
app.use("/preset-transactions", presetTransactionRoutes);
app.use("/recurring-transactions", recurringTransactionRoutes);
app.use("/accounts", accountRoutes);
app.use("/budget", budgetRoutes);
app.use("/investments", investmentRoutes);
app.use("/assets", assetRoutes);

mongoose.connect(
  `mongodb+srv://deantowheed5:${process.env.DB_PASS}@cluster0.ewv8l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
);

const PORT = process.env.PORT || 8000;

const onStartServer = async () => {
  await processRecurringTransactions();
  //await updateLastUsedAssetsPrices();
};

app.listen(PORT, async () => {
  console.log("server is running on port " + PORT);
  await onStartServer();
});
