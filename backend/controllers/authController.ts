import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { validationResult } from "express-validator";
import CustomError from "../types/Error";

const authController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      try {
        await user.save();
        res.status(201).json({ message: "user created successfully" });
      } catch (err: any) {
        const error = new CustomError(500, err.message);
        throw error;
      }
    } else {
      console.log(errors.array());
      const err = new CustomError(422, "Email validation failed.");
      console.log(err);
    }
  },
};

export default authController;
