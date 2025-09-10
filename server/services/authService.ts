import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import AccountModel from "../models/account.model";
import { createAccount } from "./accountService";

interface MongoError extends Error {
  code?: number;
  keyPattern?: { username?: string };
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

export const createUser = async (username: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashedPassword });

  createAccount({
    userId: user._id.toString(),
    name: "Default Account",
    institution: "Default Institution",
    baselineAmount: 0,
    baselineDate: new Date().toISOString().split("T")[0],
    type: "Chequing",
  });
  return user;
};

export const validateSignupError = (e: unknown): string | null => {
  const error = e as MongoError;
  if (error.code === 11000 && error.keyPattern?.username) {
    return "Username has already been taken. Please try a different username";
  }
  return null;
};

export const loginUser = async (username: string, password: string) => {
  const user = await User.findOne({ username });
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  return user;
};

export const findUserWithPreferences = async (userId: string) => {
  return await User.findById(userId).populate({
    path: "preferences.defaultAccount",
    select: "name _id",
  });
};
