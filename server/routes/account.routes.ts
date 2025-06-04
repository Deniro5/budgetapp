import express from "express";
import {
  createAccount,
  deleteAccount,
  getAccountById,
  getAccounts,
  updateAccount,
  getAccountBalancesById,
} from "../controllers/account.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/", verifyToken, createAccount);
router.get("/account-with-balances/:id", verifyToken, getAccountBalancesById);
router.get("/:id", verifyToken, getAccountById);
router.get("/", verifyToken, getAccounts);
router.put("/:id", verifyToken, updateAccount);
router.delete("/:id", verifyToken, deleteAccount);

export default router;
