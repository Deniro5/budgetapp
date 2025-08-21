import express from "express";
import {
  getPresetTransactionById,
  getPresetTransactions,
  updatePresetTransactions,
  deletePresetTransactions,
  createPresetTransaction,
} from "../controllers/presettransaction.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/", verifyToken, createPresetTransaction);
router.get("/:id", verifyToken, getPresetTransactionById);
router.get("/", verifyToken, getPresetTransactions);
router.put("/", verifyToken, updatePresetTransactions);
router.delete("/", verifyToken, deletePresetTransactions);

export default router;
