import express from "express";
import {
  getPresetTransactionById,
  getPresetTransactions,
  updatePresetTransaction,
  deletePresetTransaction,
  createPresetTransaction,
} from "../controllers/presettransaction.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/", verifyToken, createPresetTransaction);
router.get("/:id", verifyToken, getPresetTransactionById);
router.get("/", verifyToken, getPresetTransactions);
router.put("/:id", verifyToken, updatePresetTransaction);
router.delete("/:id", verifyToken, deletePresetTransaction);

export default router;
