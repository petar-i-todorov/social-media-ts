import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { getUser, passToErrorHandlerMiddleware } from "../utils/feed";

export const userController = {
  getUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const foundUser = await getUser(req.params.userId);
      if (!foundUser) {
        passToErrorHandlerMiddleware(next, 404, "Such a user was not found.");
      } else {
        res.status(200).json({
          message: "User was successfully found and returned.",
          user: foundUser,
        });
      }
    } catch (err) {
      passToErrorHandlerMiddleware(next, 500, "Something went wrong.");
    }
  },
  updateQuote: async (req: Request, res: Response, next: NextFunction) => {
    const user = await getUser(req.params.userId);
    if (!user) {
      passToErrorHandlerMiddleware(next, 500, "Such a user was not found.");
    } else {
      user.quote = req.body.quote;
      await user.save();
      res.status(200).json({
        message: "User quote was successfully updated.",
        updatedUser: user,
      });
    }
  },
};
