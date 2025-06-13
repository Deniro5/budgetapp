import express from "express";
import {
  createTransfer,
  deleteTransferByTransactionId,
  updateTransferByTransactionId,
  // getTransferById,
  // getTransfers,
  // updateTransfer,
} from "../controllers/transfer.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/", verifyToken, createTransfer);
router.delete(
  "/delete-by-transaction-id/:id",
  verifyToken,
  deleteTransferByTransactionId
);
router.delete(
  "/update-by-transaction-id/:id",
  verifyToken,
  updateTransferByTransactionId
);
// router.get("/", verifyToken, getTransfers);
// router.get("/:id", verifyToken, getTransferById);
// router.put("/:id", verifyToken, updateTransfer);
// router.delete("/:id", verifyToken, deleteTransfer);

export default router;
