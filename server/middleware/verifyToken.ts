import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({
      message: "Invalid / no token",
    });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) res.status(401).json({ message: "Invalid / no token" });

    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "server error",
    });
  }
};
