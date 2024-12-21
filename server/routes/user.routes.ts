import express from "express";
import { handleUpdate, handleGet } from "../controllers/user.controller";

const router = express.Router();

router.get("/:id", handleGet);
router.put("/update/:id", handleUpdate);

export default router;
