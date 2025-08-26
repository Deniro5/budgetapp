import { Router } from "express";
import {
  createAsset,
  searchAsset,
  getAllAssets,
  updateAsset,
  deleteAsset,
  getAssetById,
} from "../controllers/asset.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/", createAsset);
router.get("/", getAllAssets);
router.get("/search", verifyToken, searchAsset);
router.get("/:id", getAssetById);
router.put("/:id", updateAsset);
router.delete("/:id", deleteAsset);

export default router;
