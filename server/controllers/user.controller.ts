import User from "../models/user.model";
import { Request, Response } from "express";

const handleUpdate = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate({
      path: "preferences.defaultAccount",
      select: "name _id",
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
    return;
  }
};

const handleGet = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "Found user", user });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
    return;
  }
};

export { handleGet, handleUpdate };
