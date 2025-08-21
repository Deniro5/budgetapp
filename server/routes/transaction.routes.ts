import express from "express";
import {
  getTransactionById,
  getTransactions,
  updateTransactions,
  deleteTransactions,
  createTransaction,
  getTransactionCategoriesByAmount,
  getTotalIncomeAndExpense,
} from "../controllers/transaction.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/", verifyToken, createTransaction);
router.get(
  "/transaction-categories-by-amount",
  verifyToken,
  getTransactionCategoriesByAmount
);

router.get(
  "/total-income-and-expense-by-date",
  verifyToken,
  getTotalIncomeAndExpense
);

router.get("/:id", verifyToken, getTransactionById);
router.get("/", verifyToken, getTransactions);
router.put("", verifyToken, updateTransactions);
router.delete("/", verifyToken, deleteTransactions);

export default router;
