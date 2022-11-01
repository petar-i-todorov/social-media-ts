import { NextFunction } from "express";
import Post from "../models/post";
import CustomError from "../types/Error";
import User from "../models/user";
import { DevRole, SortBy } from "../types/Feed";
import { RECENCY, VOTES } from "../constants/feed";
import Comment from "../models/comment";

export const getComment = async (id: string) => {
  return Comment.findById(id)
    .populate({
      path: "creator",
      model: "User",
    })
    .populate({
      path: "votes",
      model: "CommentVote",
    });
};

export const getPost = async (id: string) => {
  return Post.findById(id)
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

export const getPosts = async (getConfig: {
  devRole: DevRole;
  sortBy: SortBy;
}) => {
  const { devRole, sortBy } = getConfig;
  let posts;
  if (devRole) {
    posts = Post.find({ devRole: devRole });
  } else {
    posts = Post.find();
  }
  if (sortBy === RECENCY) {
    posts = posts.sort({ createdAt: -1 });
  } else if (sortBy === VOTES) {
    posts = posts.sort({ upvotes: -1 });
  }
  return posts
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
        path: "creator",
        model: "User",
      },
    })
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
