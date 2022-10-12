import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { validationResult } from "express-validator";
import CustomError from "../types/Error";
import bcrypt from "bcryptjs";

const authController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });
        await user.save();
        res.status(201).json({ message: "User created successfully." });
      } catch (err: any) {
        const error = new CustomError(500, err.message);
        throw error;
      }
    } else {
      const err = new CustomError(422, "Email validation failed.");
      throw err;
    }
  },
};

export default authController;
