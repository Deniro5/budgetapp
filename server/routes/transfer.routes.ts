import express from "express";
import {
  createTransfer,
  // deleteTransfer,
  // getTransferById,
  // getTransfers,
  // updateTransfer,
} from "../controllers/transfer.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/", verifyToken, createTransfer);
// router.get("/", verifyToken, getTransfers);
// router.get("/:id", verifyToken, getTransferById);
// router.put("/:id", verifyToken, updateTransfer);
// router.delete("/:id", verifyToken, deleteTransfer);

export default router;
