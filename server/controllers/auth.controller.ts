import { Request, Response } from "express";
import * as authService from "../services/authService";

type SignupRequestBody = {
  username: string;
  password: string;
};

export const handleSignup = async (
  req: Request<unknown, unknown, SignupRequestBody>,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const user = await authService.createUser(username, password);
    const token = authService.generateToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({ message: "User created successfully", user });
  } catch (e) {
    const errorMsg = authService.validateSignupError(e);
    if (errorMsg) {
      res.status(400).json({ message: errorMsg });
      return;
    }

    res.status(500).json({ message: "Server Error" });
  }
};

export const handleLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const user = await authService.loginUser(username, password);

    if (!user) {
      res.status(401).json({ message: "Incorrect username or password" });
      return;
    }

    const token = authService.generateToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({ message: "User logged in successfully", user });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const handleLogout = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const handleCheckAuth = async (
  req: Request & { userId?: string },
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await authService.findUserWithPreferences(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User is authenticated", user });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
};
