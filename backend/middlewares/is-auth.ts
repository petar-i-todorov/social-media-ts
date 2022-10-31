import { Request, Response, NextFunction } from "express";
import { passToErrorHandlerMiddleware } from "../utils/feed";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../dev-vars";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.get("Authorization")?.split(" ")[1];
  if (!token || token === "null") {
    passToErrorHandlerMiddleware(
      next,
      401,
      "You are not authenticated. Please, log in and try again."
    );
  } else {
    try {
      const { _id } = jwt.verify(token, JWT_SECRET) as JwtPayload;
      req.body.userId = _id;
      next();
    } catch (err) {
      passToErrorHandlerMiddleware(
        next,
        401,
        "You are not authenticated. Please, log in and try again."
      );
    }
  }
};
