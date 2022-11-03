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
  lastPostDate: string | undefined;
  lastPostVotes: string | undefined;
}) => {
  const { devRole, sortBy, lastPostDate, lastPostVotes } = getConfig;
  let posts;
  if (sortBy === RECENCY) {
    if (lastPostDate !== "null") {
      posts = Post.find({ devRole: devRole, createdAt: { $lt: lastPostDate } })
        .sort({ createdAt: -1 })
        .limit(10);
    } else {
      posts = Post.find({ devRole: devRole }).sort({ createdAt: -1 }).limit(10);
    }
  } else if (lastPostVotes !== "null" && lastPostDate !== "null") {
    posts = Post.find({
      $or: [
        {
          devRole: devRole,
          upvotes: { $eq: Number(lastPostVotes) },
          createdAt: { $lt: lastPostDate },
        },
        {
          devRole: devRole,
          upvotes: { $lt: Number(lastPostVotes) },
        },
      ],
    })
      .sort({ upvotes: -1, createdAt: -1 })
      .limit(10);
  } else {
    posts = Post.find({ devRole: devRole })
      .sort({ upvotes: -1, createdAt: -1 })
      .limit(10);
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
      options: {
        limit: 2,
        sort: {
          createdAt: -1,
        },
      },
      populate: {
        path: "creator",
        model: "User",
      },
    })
    .populate({
      path: "posts.comments.creator",
      model: "User",
    })
    .populate({
      path: "posts.comments.votes",
      model: "CommentVote",
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
