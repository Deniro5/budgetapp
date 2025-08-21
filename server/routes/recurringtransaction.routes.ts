import express from "express";
import {
  createRecurringTransaction,
  deleteRecurringTransactions,
  getRecurringTransactionById,
  getRecurringTransactions,
  updateRecurringTransactions,
} from "../controllers/recurringtransaction.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/", verifyToken, createRecurringTransaction);
router.get("/:id", verifyToken, getRecurringTransactionById);
router.get("/", verifyToken, getRecurringTransactions);
router.put("/", verifyToken, updateRecurringTransactions);
router.delete("/", verifyToken, deleteRecurringTransactions);

export default router;
