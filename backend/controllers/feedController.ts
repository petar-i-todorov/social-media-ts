import { NextFunction, Request, Response } from "express";
import Post from "../models/post";
import CustomError from "../types/Error";
import { validationResult } from "express-validator";
import { createTransport } from "nodemailer";
import { HOTMAIL_PASSWORD, HOTMAIL_USER } from "../dev-vars";
import { getPosts, passToErrorHandlerMiddleware } from "../utils/feed";
import Comment from "../models/comment";
import CommentVote from "../models/commentVote";
import user from "../models/user";

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
        const creator = await user.findById(req.body.creator);
        if (!creator) {
          passToErrorHandlerMiddleware(next, 404, "Something went wrong.");
        } else {
          const createdPost = new Post({
            creator: creator._id,
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            devRole: req.body.devRole,
            platform: req.body.platform,
          });
          await createdPost.save();
          creator.posts.push(createdPost._id as any);
          await creator.save();
          setTimeout(() => {
            res.json({ message: "Post was created successfully." });
          }, 2000);
        }
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
    try {
      await Post.deleteOne({ _id: req.params.postId });
      res.status(200).json({
        message: "Post was successfully deleted.",
        updatedPosts: await getPosts(),
      });
    } catch (err) {
      passToErrorHandlerMiddleware(next, 500, "Something went wrong.");
    }
  },
  reportPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
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
          "Post was successfully reported. We'll check and delete it in case we find out that it goes against our rules.",
      });
    } catch (err) {
      passToErrorHandlerMiddleware(next, 500, "Something went wrong.");
    }
  },
  editPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
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
        message: "Post was successfully edited.",
      });
    } catch (err) {
      passToErrorHandlerMiddleware(next, 500, "Something went wrong.");
    }
  },
  addComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newComment = new Comment({
        text: req.body.text,
        post: req.params.postId,
        creator: req.body.creatorId,
      });
      await newComment.save();
      const foundPost = await Post.findById(req.params.postId);
      if (foundPost) {
        foundPost.comments.push(newComment._id as any);
        await foundPost.save();
        const posts = await getPosts();
        res.status(201).json({
          message: "Comment was successfully added.",
          updatedPosts: posts,
        });
      } else {
        passToErrorHandlerMiddleware(next, 404, "Such a post was not found.");
      }
    } catch (err) {
      passToErrorHandlerMiddleware(next, 500, "Something went wrong.");
    }
  },
  likeComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const foundComment = await Comment.findById(req.params.commentId);
      if (!foundComment) {
        passToErrorHandlerMiddleware(
          next,
          404,
          "Such a comment was not found."
        );
      } else {
        const populatedComment = await foundComment.populate("votes");
        const prevVoteByUser: any = populatedComment.votes.find((vote: any) => {
          if (vote.user._id.toString() === req.body.userId) {
            return true;
          }
          return false;
        });
        if (!prevVoteByUser) {
          const commentVote = new CommentVote({
            isLike: true,
            comment: foundComment._id,
            user: req.body.userId,
          });
          await commentVote.save();
          populatedComment.votes.push(commentVote._id as any);
          await populatedComment.save();
          res.status(200).json({
            message: "Comment was successfully liked.",
            updatedPosts: await getPosts(),
          });
        } else if (!prevVoteByUser.isLike) {
          const commentVote = new CommentVote({
            isLike: true,
            comment: foundComment._id,
            user: req.body.userId,
          });
          await commentVote.save();
          populatedComment.votes.push(commentVote._id as any);
          populatedComment.votes = populatedComment.votes.filter(
            (vote: any) => vote._id !== prevVoteByUser._id
          );
          await populatedComment.save();
          await CommentVote.findByIdAndDelete(prevVoteByUser._id);
          res.status(200).json({
            message: "Comment was successfully liked.",
            updatedPosts: await getPosts(),
          });
        } else {
          await CommentVote.findByIdAndDelete(prevVoteByUser._id);
          populatedComment.votes.filter(
            (vote: any) => vote._id !== prevVoteByUser._id
          );
          await populatedComment.save();
          res.status(200).json({
            message: "Like was successfully removed.",
            updatedPosts: await getPosts(),
          });
        }
      }
    } catch (err) {
      console.log(err);
      passToErrorHandlerMiddleware(next, 500, "Something went wrong.");
    }
  },
  dislikeComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const foundComment = await Comment.findById(req.params.commentId);
      if (!foundComment) {
        passToErrorHandlerMiddleware(
          next,
          404,
          "Such a comment was not found."
        );
      } else {
        const populatedComment = await foundComment.populate("votes");
        const prevVoteByUser: any = populatedComment.votes.find((vote: any) => {
          if (vote.user._id.toString() === req.body.userId) {
            return true;
          }
          return false;
        });
        if (!prevVoteByUser) {
          const commentVote = new CommentVote({
            isLike: false,
            comment: foundComment._id,
            user: req.body.userId,
          });
          await commentVote.save();
          populatedComment.votes.push(commentVote._id as any);
          await populatedComment.save();
          res.status(200).json({
            message: "Comment was successfully liked.",
            updatedPosts: await getPosts(),
          });
        } else if (prevVoteByUser.isLike) {
          const commentVote = new CommentVote({
            isLike: false,
            comment: foundComment._id,
            user: req.body.userId,
          });
          await commentVote.save();
          populatedComment.votes.push(commentVote._id as any);
          populatedComment.votes = populatedComment.votes.filter(
            (vote: any) => vote._id !== prevVoteByUser._id
          );
          await populatedComment.save();
          await CommentVote.findByIdAndDelete(prevVoteByUser._id);
          res.status(200).json({
            message: "Comment was successfully liked.",
            updatedPosts: await getPosts(),
          });
        } else {
          await CommentVote.findByIdAndDelete(prevVoteByUser._id);
          populatedComment.votes.filter(
            (vote: any) => vote._id !== prevVoteByUser._id
          );
          await populatedComment.save();
          res.status(200).json({
            message: "Like was successfully removed.",
            updatedPosts: await getPosts(),
          });
        }
      }
    } catch (err) {
      console.log(err);
      passToErrorHandlerMiddleware(next, 500, "Something went wrong.");
    }
  },
};
