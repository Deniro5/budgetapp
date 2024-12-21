import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import transactionRoutes from "./routes/transaction.routes";
import presetTransactionRoutes from "./routes/presettransaction.routes";

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

app.use("/user", userRoutes);
app.use("/auth", authRoutes);

// Routes
app.use("/transactions", transactionRoutes);
app.use("/preset-transactions", presetTransactionRoutes);

mongoose.connect(
  `mongodb+srv://deantowheed5:${process.env.DB_PASS}@cluster0.ewv8l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the MeRN server!");
});
