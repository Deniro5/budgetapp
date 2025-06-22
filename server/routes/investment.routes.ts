import express from "express";
import {
  createInvestment,
  getInvestments,
  searchStocks,
} from "../controllers/investment.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/search", verifyToken, searchStocks);
router.get("/", verifyToken, getInvestments);
router.post("/", verifyToken, createInvestment);

export default router;
