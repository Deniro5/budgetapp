import { Request, Response } from "express";
import * as userService from "../services/userService";

export const handleUpdate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedUser = await userService.updateUserById(
      req.params.id,
      req.body
    );

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const handleGet = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "Found user", user });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
};
