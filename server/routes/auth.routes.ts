import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import {
  handleSignup,
  handleLogin,
  handleLogout,
  handleCheckAuth,
} from "../controllers/auth.controller";
import { Router, Request, Response } from "express";

const router = express.Router();

router.post("/signup", handleSignup);

router.post("/login", handleLogin);
router.post("/logout", handleLogout);

router.get("/check-auth", verifyToken, handleCheckAuth);

export default router;
