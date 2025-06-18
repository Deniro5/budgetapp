import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model";

interface MongoError extends Error {
  code?: number;
  keyPattern?: { username?: string };
}
const generateTokenAndSetCookie = async (
  res: Response,
  userId: string
): Promise<void> => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
};

type SignupRequestBody = {
  username: string;
  password: string;
};

const handleSignup = async (
  req: Request<unknown, unknown, SignupRequestBody>,
  res: Response
) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    await generateTokenAndSetCookie(res, user._id.toString());

    res.status(200).json({ message: "User created successfully", user });
  } catch (e) {
    const error = e as MongoError;

    if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
      res.status(400).json({
        message:
          "Username has already been taken. Please try a different username",
      });
      return;
    }

    res.status(500).json({ message: "Server Error" });
    return;
  }
};

const handleLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      res.status(401).json({ message: "Incorrect username or password" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      res.status(401).json({ message: "Incorrect username or password" });
      return;
    }

    await generateTokenAndSetCookie(res, user._id.toString());

    res.status(200).json({ message: "User logged in successfully", user });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server Error" });
    return;
  }
};

const handleLogout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
    return;
  }
};

const handleCheckAuth = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "preferences.defaultAccount",
      select: "name _id",
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User is authenticated", user });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
    return;
  }
};

export { handleSignup, handleLogin, handleLogout, handleCheckAuth };
