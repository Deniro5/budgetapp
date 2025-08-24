import { Router } from "express";
import { assetController } from "../controllers/asset.controller";

const router = Router();

router.post("/", assetController.create);
router.get("/", assetController.getAll);
router.get("/:id", assetController.getById);
router.put("/:id", assetController.update);
router.delete("/:id", assetController.remove);

export default router;
