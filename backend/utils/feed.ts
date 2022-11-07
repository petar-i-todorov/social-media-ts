import { NextFunction } from "express";
import Post from "../models/post";
import CustomError from "../types/Error";
import User from "../models/user";
import { DevRole, SortBy } from "../types/Feed";
import { postsPerPage, RECENCY } from "../constants/feed";
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
      model: "Comment",
      options: {
        sort: { createdAt: -1 },
      },
      populate: {
        path: "creator",
        model: "User",
      },
    })
    .populate("comments.votes");
};

export const getPosts = async (getConfig: {
  devRole: DevRole;
  sortBy: SortBy;
  lastPostDate: string | undefined;
  lastPostVotes: string | undefined;
  substring: string | undefined;
}) => {
  const { devRole, sortBy, lastPostDate, lastPostVotes, substring } = getConfig;
  let posts;
  if (sortBy === RECENCY) {
    if (lastPostDate) {
      posts = Post.find({ devRole: devRole, createdAt: { $lt: lastPostDate } })
        .sort({ createdAt: -1 })
        .limit(10);
    } else if (substring) {
      posts = Post.find({
        $or: [
          { devRole: devRole, title: { $regex: new RegExp(substring, "i") } },
          {
            devRole: devRole,
            description: { $regex: new RegExp(substring, "i") },
          },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(10);
    } else {
      posts = Post.find({ devRole: devRole }).sort({ createdAt: -1 }).limit(10);
    }
  } else if (lastPostVotes && lastPostDate) {
    posts = Post.find({
      $or: [
        {
          devRole: devRole,
          upvotes: { $eq: Number(lastPostVotes) },
          createdAt: { $gt: lastPostDate },
        },
        {
          devRole: devRole,
          upvotes: { $lt: Number(lastPostVotes) },
        },
      ],
    })
      .sort({ upvotes: -1, createdAt: -1 })
      .limit(10);
  } else if (substring) {
    posts = Post.find({
      $or: [
        {
          devRole: devRole,
          title: { $regex: new RegExp(substring, "i") },
        },
        {
          devRole: devRole,
          description: { $regex: new RegExp(substring, "i") },
        },
      ],
    })
      .sort({ upvotes: -1, createdAt: -1 })
      .limit(10);
  } else {
    posts = Post.find({ devRole: devRole }).limit(10);
  }
  return posts
    .populate("creator")
    .populate({
      path: "comments",
      model: "Comment",
      options: {
        sort: { createdAt: -1 },
      },
      populate: {
        path: "creator",
        model: "User",
      },
    })
    .populate("comments.votes");
};

export const getUser = async (userId: string) => {
  return await User.findById(userId)
    .populate({
      path: "posts",
      model: "Post",
      options: {
        limit: postsPerPage,
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
