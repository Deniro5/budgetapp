import express from "express";
import {
  createInvestment,
  getAllInvestments,
  getCurrentAggregatedInvestments,
  deleteInvestment,
} from "../controllers/investment.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/", verifyToken, getCurrentAggregatedInvestments);
router.get("/history", verifyToken, getAllInvestments);
router.post("/", verifyToken, createInvestment);
router.delete("/:id", verifyToken, deleteInvestment);

export default router;
