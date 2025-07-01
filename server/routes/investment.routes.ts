import express from "express";
import {
  createInvestment,
  getAllInvestments,
  getCurrentAggregatedInvestments,
  searchStocks,
} from "../controllers/investment.controller";
import { verifyToken } from "../middleware/verifyToken";
import { updateAssetPriceHistory } from "../middleware/updateAssetPriceHistory";

const router = express.Router();

router.get("/search", verifyToken, searchStocks);
router.get(
  "/",
  verifyToken,
  getCurrentAggregatedInvestments,
  updateAssetPriceHistory
);
router.get("/history", verifyToken, getAllInvestments);
router.post("/", verifyToken, createInvestment);

export default router;
