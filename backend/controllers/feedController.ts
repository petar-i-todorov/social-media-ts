import { NextFunction, Request, Response } from "express";
import Post from "../models/post";
import CustomError from "../types/Error";
import { validationResult } from "express-validator";
import { createTransport } from "nodemailer";
import { HOTMAIL_PASSWORD, HOTMAIL_USER } from "../dev-vars";
import { getPosts, passToErrorHandlerMiddleware } from "../utils/feed";

const transporter = createTransport({
  service: "hotmail",
  auth: {
    user: HOTMAIL_USER,
    pass: HOTMAIL_PASSWORD,
  },
});

export const feedController = {
  getPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        passToErrorHandlerMiddleware(next, 404, "Such a post was not found.");
      }
      res.status(200).json({ post: post });
    } catch (err) {
      passToErrorHandlerMiddleware(next, 500, "Something went wrong.");
    }
  },
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
        passToErrorHandlerMiddleware(
          next,
          422,
          validationResult(req).array()[0].msg
        );
      }
    } catch (err) {
      passToErrorHandlerMiddleware(next, 500, "Something went wrong.");
    }
  },
  getPosts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await getPosts();
      if (!posts) {
        passToErrorHandlerMiddleware(next, 404, "Such a post was not found.");
      }
      res.status(200).json(posts);
    } catch (err) {
      passToErrorHandlerMiddleware(next, 500, "Something went wrong.");
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
          res.status(200).json({
            updatedPosts: await getPosts(),
            message: "Post was successfully updated.",
          });
        } else {
          foundPost.upvotes++;
          foundPost.upvotedBy.push(req.body.userId);
          await foundPost.save();
          res.status(200).json({
            updatedPosts: await getPosts(),
            message: "Post was successfully updated.",
          });
        }
      } else {
        const err = new CustomError(404, "Such a post was not found.");
        throw err;
      }
    } catch (err) {
      passToErrorHandlerMiddleware(next, 500, "Something went wrong.");
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
          res.status(200).json({
            updatedPosts: await getPosts(),
            message: "Post was successfully updated.",
          });
        } else {
          foundPost.upvotes--;
          foundPost.downvotedBy.push(req.body.userId);
          await foundPost.save();
          res.status(200).json({
            updatedPosts: await getPosts(),
            message: "Post was successfully updated.",
          });
        }
      } else {
        passToErrorHandlerMiddleware(next, 404, "Such a post was not found.");
      }
    } catch (err) {
      passToErrorHandlerMiddleware(next, 500, "Something went wrong.");
    }
  },
  deletePost: async (req: Request, res: Response, next: NextFunction) => {
    await Post.deleteOne({ _id: req.params.postId });
    res.status(200).json({
      message: "Post was successfully deleted.",
      updatedPosts: await getPosts(),
    });
  },
  reportPost: async (req: Request, res: Response, next: NextFunction) => {
    await transporter.sendMail({
      from: HOTMAIL_USER,
      to: HOTMAIL_USER,
      subject: "A post was reported.",
      html: `<h2>Post with id ${req.params.postId} was reported.</h2>
      <br/>
      <hr/>
      <br/>
      <p>Report type: ${req.body.reportType}</p>
      <p>Report description: ${req.body.reportMessage || "None"}</p>`,
    });
    res.status(200).json({
      message:
        "Post was successfully reported. We'll check and delete it in case we find out that it breaks our rules.",
    });
  },
  editPost: async (req: Request, res: Response, next: NextFunction) => {
    await Post.updateOne(
      { _id: req.body.id },
      {
        title: req.body.title,
        desc: req.body.description,
        url: req.body.url,
        devRole: req.body.devRole,
        platform: req.body.platform,
      }
    );
    res.status(200).json({
      updatedPosts: await getPosts(),
      message: "Post was successfully edit.",
    });
  },
};
