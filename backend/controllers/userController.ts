import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { passToErrorHandlerMiddleware } from "../utils/feed";

export const userController = {
  getUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const foundUser = await User.findById(req.params.userId)
        .populate({
          path: "posts",
          model: "Post",
          populate: {
            path: "comments",
            model: "Comment",
            populate: {
              path: "creator",
              model: "User",
            },
          },
        })
        .populate({
          path: "posts",
          model: "Post",
          populate: {
            path: "comments",
            model: "Comment",
            populate: {
              path: "votes",
              model: "CommentVote",
              populate: {
                path: "user",
                model: "User",
              },
            },
          },
        });
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
};
