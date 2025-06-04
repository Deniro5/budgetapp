import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import { getBudget, updateBudget } from "../controllers/budget.controller";

const router = express.Router();

router.get("/", verifyToken, getBudget);
router.put("/", verifyToken, updateBudget);

export default router;
