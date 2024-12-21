import express from "express";
import {
  getTransactionById,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  createTransaction,
} from "../controllers/transaction.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/", verifyToken, createTransaction);
router.get("/:id", verifyToken, getTransactionById);
router.get("/", verifyToken, getTransactions);
router.put("/:id", verifyToken, updateTransaction);
router.delete("/:id", verifyToken, deleteTransaction);

export default router;
