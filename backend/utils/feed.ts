import { NextFunction } from "express";
import Post from "../models/post";
import CustomError from "../types/Error";
import User from "../models/user";

export const getPosts = async () => {
  return await Post.find()
    .populate("creator")
    .populate({
      path: "comments",
      populate: {
        path: "creator",
        model: "User",
      },
    })
    .populate({
      path: "comments",
      populate: {
        path: "votes",
        model: "CommentVote",
      },
    });
};

export const getUser = async (userId: string) => {
  return await User.findById(userId)
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
        },
      },
    });
};

export const passToErrorHandlerMiddleware = (
  next: NextFunction,
  status: number,
  textError: string
) => {
  const error = new CustomError(status, textError);
  next(error);
};
