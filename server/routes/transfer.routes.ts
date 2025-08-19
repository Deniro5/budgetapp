import express from "express";
import {
  createTransfer,
  deleteTransferByTransactionId,
  updateTransferByTransactionId,
} from "../controllers/transfer.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/", verifyToken, createTransfer);
router.put(
  "/update-by-transaction-id/:id",
  verifyToken,
  updateTransferByTransactionId
);
router.delete(
  "/delete-by-transaction-id/:id",
  verifyToken,
  deleteTransferByTransactionId
);

export default router;
