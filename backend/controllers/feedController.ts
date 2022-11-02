import { NextFunction, Request, Response } from "express";
import Post from "../models/post";
import { validationResult } from "express-validator";
import { createTransport } from "nodemailer";
import { HOTMAIL_PASSWORD, HOTMAIL_USER } from "../dev-vars";
import {
  getComment,
  getPost,
  getPosts,
  passToErrorHandlerMiddleware,
} from "../utils/feed";
import Comment from "../models/comment";
import CommentVote from "../models/commentVote";
import user from "../models/user";
import { BACKEND, DEVOPS, FRONTEND, RECENCY, VOTES } from "../constants/feed";

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
          setTimeout(async () => {
            res.json({
              message: "Post was created successfully.",
              createdPost: await getPost(createdPost._id.toString()),
            });
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
      if (
        !(
          req.query.devRole === FRONTEND ||
          req.query.devRole === BACKEND ||
          req.query.devRole === DEVOPS
        ) ||
        !(req.query.sortBy === RECENCY || req.query.sortBy === VOTES) ||
        !(
          typeof req.query.lastPostDate === "string" ||
          req.query.lastPostDate === undefined
        ) ||
        !(
          typeof req.query.lastPostVotes === "string" ||
          req.query.lastPostVotes === undefined
        )
      ) {
        passToErrorHandlerMiddleware(next, 500, "Invalid query params.");
      } else {
        const posts = await getPosts({
          devRole: req.query.devRole,
          sortBy: req.query.sortBy,
          lastPostDate: req.query.lastPostDate,
          lastPostVotes: req.query.lastPostVotes,
        });
        if (!posts) {
          passToErrorHandlerMiddleware(next, 404, "Such a post was not found.");
        }
        res.status(200).json(posts);
      }
    } catch (err) {
      passToErrorHandlerMiddleware(next, 500, "Something went wrong.");
    }
  },
  upvotePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const foundPost = await getPost(req.body.postId);
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
            updatedPost: foundPost,
            message: "Post was successfully updated.",
          });
        } else {
          foundPost.upvotes++;
          foundPost.upvotedBy.push(req.body.userId);
          await foundPost.save();
          res.status(200).json({
            updatedPost: foundPost,
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
  downvotePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const foundPost = await getPost(req.body.postId);
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
            updatedPost: foundPost,
            message: "Post was successfully updated.",
          });
        } else {
          foundPost.upvotes--;
          foundPost.downvotedBy.push(req.body.userId);
          await foundPost.save();
          res.status(200).json({
            updatedPost: foundPost,
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
      const postToDelete = await Post.findById(req.params.postId);
      if (postToDelete) {
        if (postToDelete.creator.toString() === req.body.userId) {
          await Post.deleteOne({ _id: req.params.postId });
          res.status(200).json({
            message: "Post was successfully deleted.",
          });
        } else {
          passToErrorHandlerMiddleware(
            next,
            401,
            "You are not authorized to delete other people's posts."
          );
        }
      } else {
        passToErrorHandlerMiddleware(next, 404, "Such a post was not found.");
      }
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
      const foundPost = await Post.findById(req.params.postId);
      if (!foundPost) {
        passToErrorHandlerMiddleware(next, 404, "Such a post was not found.");
      } else {
        if (req.body.userId === foundPost.creator.toString()) {
          await Post.updateOne(
            { _id: req.params.postId },
            {
              title: req.body.title,
              description: req.body.description,
              url: req.body.url,
              devRole: req.body.devRole,
              platform: req.body.platform,
            }
          );
          res.status(200).json({
            updatedPost: await getPost(req.params.postId),
            message: "Post was successfully edited.",
          });
        } else {
          passToErrorHandlerMiddleware(
            next,
            401,
            "You are not authorized to edit other people's posts."
          );
        }
      }
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
        const post = await getPost(req.params.postId);
        res.status(201).json({
          message: "Comment was successfully added.",
          updatedPost: post,
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
      const foundComment = await getComment(req.params.commentId);
      if (!foundComment) {
        passToErrorHandlerMiddleware(
          next,
          404,
          "Such a comment was not found."
        );
      } else {
        const prevVoteByUser: any = foundComment.votes.find((vote: any) => {
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
          foundComment.votes.push(commentVote._id as any);
          await foundComment.save();
          res.status(200).json({
            message: "Comment was successfully liked.",
            updatedComment: await getComment(foundComment._id.toString()),
          });
        } else if (!prevVoteByUser.isLike) {
          const commentVote = new CommentVote({
            isLike: true,
            comment: foundComment._id,
            user: req.body.userId,
          });
          await commentVote.save();
          foundComment.votes.push(commentVote._id as any);
          foundComment.votes = foundComment.votes.filter(
            (vote: any) => vote._id !== prevVoteByUser._id
          );
          await foundComment.save();
          await CommentVote.findByIdAndDelete(prevVoteByUser._id);
          res.status(200).json({
            message: "Comment was successfully liked.",
            updatedComment: await getComment(foundComment._id.toString()),
          });
        } else {
          await CommentVote.findByIdAndDelete(prevVoteByUser._id);
          foundComment.votes = foundComment.votes.filter(
            (vote: any) => vote._id !== prevVoteByUser._id
          );
          await foundComment.save();
          res.status(200).json({
            message: "Like was successfully removed.",
            updatedComment: foundComment,
          });
        }
      }
    } catch (err) {
      passToErrorHandlerMiddleware(next, 500, "Something went wrong.");
    }
  },
  dislikeComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const foundComment = await getComment(req.params.commentId);
      if (!foundComment) {
        passToErrorHandlerMiddleware(
          next,
          404,
          "Such a comment was not found."
        );
      } else {
        const prevVoteByUser: any = foundComment.votes.find((vote: any) => {
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
          foundComment.votes.push(commentVote._id as any);
          await foundComment.save();
          res.status(200).json({
            message: "Comment was successfully liked.",
            updatedComment: await foundComment.populate("votes"),
          });
        } else if (prevVoteByUser.isLike) {
          const commentVote = new CommentVote({
            isLike: false,
            comment: foundComment._id,
            user: req.body.userId,
          });
          await commentVote.save();
          foundComment.votes.push(commentVote._id as any);
          foundComment.votes = foundComment.votes.filter(
            (vote: any) => vote._id !== prevVoteByUser._id
          );
          await foundComment.save();
          await CommentVote.findByIdAndDelete(prevVoteByUser._id);
          res.status(200).json({
            message: "Comment was successfully liked.",
            updatedComment: await foundComment.populate("votes"),
          });
        } else {
          await CommentVote.findByIdAndDelete(prevVoteByUser._id);
          foundComment.votes = foundComment.votes.filter(
            (vote: any) => vote._id !== prevVoteByUser._id
          );
          await foundComment.save();
          res.status(200).json({
            message: "Like was successfully removed.",
            updatedComment: foundComment,
          });
        }
      }
    } catch (err) {
      passToErrorHandlerMiddleware(next, 500, "Something went wrong.");
    }
  },
};
