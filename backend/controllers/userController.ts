import { Request, Response, NextFunction } from "express";
import { postsPerPage } from "../constants/feed";
import Post from "../models/post";
import User from "../models/user";
import { getUser, passToErrorHandlerMiddleware } from "../utils/feed";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const userController = {
  getUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const foundUser = await getUser(req.params.userId);
      if (!foundUser) {
        passToErrorHandlerMiddleware(next, 404, "Such a user was not found.");
      } else {
        const user = await User.findById(req.params.userId).populate("posts");
        res.status(200).json({
          message: "User was successfully found and returned.",
          user: foundUser,
          postsCount: user?.posts.length,
        });
      }
    } catch (err) {
      passToErrorHandlerMiddleware(next, 500, "Something went wrong.");
    }
  },
  getUserPosts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page);
      let posts;
      if (typeof page === "number") {
        posts = await Post.find({ creator: req.params.userId })
          .sort({ createdAt: -1 })
          .skip((page - 1) * postsPerPage)
          .limit(postsPerPage)
          .populate("creator")
          .populate({
            path: "comments",
            model: "Comment",
            populate: {
              path: "creator",
              model: "User",
            },
          })
          .populate({ path: "comments.votes", model: "CommentVote" });
      }
      if (posts) {
        res.status(200).json({
          message: "Posts were successfully found and returned.",
          posts: posts,
        });
      } else {
        res.status(404).json({
          message: "Posts associated with that user could not be found.",
        });
      }
    } catch (err) {
      passToErrorHandlerMiddleware(next, 500, "Something went wrong.");
    }
  },
  updateQuote: async (req: Request, res: Response, next: NextFunction) => {
    const user = await getUser(req.params.userId);
    if (!user) {
      passToErrorHandlerMiddleware(next, 404, "Such a user was not found.");
    } else {
      user.quote = req.body.quote;
      await user.save();
      res.status(200).json({
        message: "User quote was successfully updated.",
        updatedUser: user,
      });
    }
  },
  updateAvatar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        passToErrorHandlerMiddleware(next, 404, "Such a user was not found.");
      } else {
        if (user.avatarUrl) {
          fs.unlink(path.join(__dirname, "..", user.avatarUrl), (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
        if (req.file) {
          await User.findByIdAndUpdate(req.params.userId, {
            avatarUrl: req.file.path.replace("\\", "/"),
          });
          const updatedUser = await User.findById(req.params.userId);
          res.status(200).json({
            message: "Avatar was successfully updated.",
            updatedUser: updatedUser,
          });
        } else {
          passToErrorHandlerMiddleware(
            next,
            422,
            "No avatar was found. Please, try again later."
          );
        }
      }
    } catch (err) {
      passToErrorHandlerMiddleware(
        next,
        500,
        "Something went wrong. Please, try again later."
      );
    }
  },
  getAvatar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        passToErrorHandlerMiddleware(next, 404, "Such a user was not found.");
      } else {
        res.status(200).json({
          message: "Avatar was successfully fetched.",
          avatarUrl: user.avatarUrl,
        });
      }
    } catch (err) {
      passToErrorHandlerMiddleware(next, 500, "Something went wrong.");
    }
  },
};
