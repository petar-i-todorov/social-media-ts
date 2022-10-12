import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { validationResult } from "express-validator";
import CustomError from "../types/Error";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../dev-vars";

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
  login: async (req: Request, res: Response, next: NextFunction) => {
    const foundUser = await User.findOne({ email: req.body.email });
    if (!foundUser) {
      const err = new CustomError(
        404,
        "User with such an email was not found."
      );
      throw err;
    } else {
      if (foundUser.password) {
        const doesMatch = await bcrypt.compare(
          req.body.password,
          foundUser.password
        );
        if (doesMatch) {
          const token = jwt.sign(
            {
              email: foundUser.email,
              _id: foundUser._id.toString(),
            },
            JWT_SECRET
          );
          res.status(200).json({
            token: token,
            userId: foundUser._id.toString(),
            message: "User logged in successfully.",
          });
        } else {
          const err = new CustomError(
            422,
            "Validation failed. Wrong password."
          );
          throw err;
        }
      } else {
        const err = new CustomError(
          422,
          "It seems like there is no password saved for this user. Please, contact our Customer Service."
        );
        throw err;
      }
    }
  },
};

export default authController;
