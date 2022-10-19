import { NextFunction, Request, Response } from "express";
import Post from "../models/post";
import CustomError from "../types/Error";
import { validationResult } from "express-validator";

export const feedController = {
  createPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validationResult(req).isEmpty()) {
        const createdPost = new Post({
          creator: req.body.creator,
          title: req.body.title,
          description: req.body.description,
          url: req.body.url,
          devRole: req.body.devRole,
          platform: req.body.platform,
        });
        await createdPost.save();
        setTimeout(() => {
          res.json({ message: "Post was created successfully." });
        }, 2000);
      } else {
        const error = new CustomError(
          422,
          validationResult(req).array()[0].msg
        );
        throw error;
      }
    } catch (err) {
      if (!(err instanceof CustomError)) {
        const error = new CustomError(500, "Something went wrong.");
        next(error);
      }
      next(err);
    }
  },
  getPosts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await Post.find();
      if (!posts) {
        const err = new CustomError(
          404,
          "Posts were not found in our storages."
        );
        throw err;
      }
      res.status(200).json(posts);
    } catch (err) {
      if (!(err instanceof CustomError)) {
        const error = new CustomError(500, "Something went wrong.");
        next(error);
      } else {
        next(err);
      }
    }
  },
  upvotePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const foundPost = await Post.findOne({ _id: req.body.postId });
      if (foundPost) {
        if (
          foundPost.upvotedBy.find(
            (userId) => userId.toString() === req.body.userId
          )
        ) {
          res
            .status(500)
            .json({ message: "You cannot upvote a post more than once." });
        } else if (
          foundPost.downvotedBy.find(
            (userId) => userId.toString() === req.body.userId
          )
        ) {
          foundPost.upvotes += 2;
          foundPost.upvotedBy.push(req.body.userId);
          foundPost.downvotedBy = foundPost.downvotedBy.filter(
            (id) => id.toString() !== req.body.userId
          );
          await foundPost.save();
          const posts = await Post.find();
          res.status(200).json({
            updatedPosts: posts,
            message: "Post was successfully updated.",
          });
        } else {
          foundPost.upvotes++;
          foundPost.upvotedBy.push(req.body.userId);
          await foundPost.save();
          const posts = await Post.find();
          res.status(200).json({
            updatedPosts: posts,
            message: "Post was successfully updated.",
          });
        }
      } else {
        const err = new CustomError(404, "Such a post was not found.");
        throw err;
      }
    } catch (err) {
      if (!(err instanceof CustomError)) {
        const error = new CustomError(500, "Something went wrong.");
        next(error);
      }
      next(err);
    }
  },
  downvotePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const foundPost = await Post.findOne({ _id: req.body.postId });
      if (foundPost) {
        if (
          foundPost.downvotedBy.find(
            (userId) => userId.toString() === req.body.userId
          )
        ) {
          res
            .status(500)
            .json({ message: "You cannot downvote a post more than once." });
        } else if (
          foundPost.upvotedBy.find(
            (userId) => userId.toString() === req.body.userId
          )
        ) {
          foundPost.upvotes -= 2;
          foundPost.downvotedBy.push(req.body.userId);
          foundPost.upvotedBy = foundPost.upvotedBy.filter(
            (id) => id.toString() !== req.body.userId
          );
          await foundPost.save();
          const posts = await Post.find();
          res.status(200).json({
            updatedPosts: posts,
            message: "Post was successfully updated.",
          });
        } else {
          foundPost.upvotes--;
          foundPost.downvotedBy.push(req.body.userId);
          await foundPost.save();
          const posts = await Post.find();
          res.status(200).json({
            updatedPosts: posts,
            message: "Post was successfully updated.",
          });
        }
      } else {
        const err = new CustomError(404, "Such a post was not found.");
        throw err;
      }
    } catch (err) {
      if (!(err instanceof CustomError)) {
        const error = new CustomError(500, "Something went wrong.");
        next(error);
      }
      next(err);
    }
  },
};
