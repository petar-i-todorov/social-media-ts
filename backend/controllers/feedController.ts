import { NextFunction, Request, Response } from "express";
import Post from "../models/post";

export const feedController = {
  createPost: (req: Request, res: Response, next: NextFunction) => {
    const createdPost = new Post({
      creator: req.body.creator,
      title: req.body.title,
      description: req.body.description,
      url: req.body.url,
      devRole: req.body.devRole,
      platform: req.body.platform,
    });
    createdPost.save();
    setTimeout(() => {
      res.json({ message: "Post was created successfully." });
    }, 2000);
  },
  getPosts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await Post.find();
      res.status(200).json(posts);
    } catch (err) {
      //todo
    }
  },
};
