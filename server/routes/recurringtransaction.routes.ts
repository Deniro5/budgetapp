import express from "express";
import {
  createRecurringTransaction,
  deleteRecurringTransaction,
  getRecurringTransactionById,
  getRecurringTransactions,
  updateRecurringTransaction,
} from "../controllers/recurringtransaction.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/", verifyToken, createRecurringTransaction);
router.get("/:id", verifyToken, getRecurringTransactionById);
router.get("/", verifyToken, getRecurringTransactions);
router.put("/:id", verifyToken, updateRecurringTransaction);
router.delete("/:id", verifyToken, deleteRecurringTransaction);

export default router;
