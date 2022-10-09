import { NextFunction, Request, Response } from "express";
import User from "../models/user";

const authController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    try {
      await user.save();
      res.status(201).json({ message: "user created successfully" });
    } catch (err) {
      console.log(err);
    }
  },
};

export default authController;
