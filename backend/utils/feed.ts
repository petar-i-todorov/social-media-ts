import { NextFunction } from "express";
import Post from "../models/post";
import CustomError from "../types/Error";

export const getPosts = async () => {
  return await Post.find()
    .populate("creator")
    .populate({
      path: "comments",
      populate: {
        path: "creator",
        model: "User",
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
