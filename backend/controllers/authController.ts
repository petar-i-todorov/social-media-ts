import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { validationResult } from "express-validator";
import CustomError from "../types/Error";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { HOTMAIL_PASSWORD, HOTMAIL_USER, JWT_SECRET } from "../dev-vars";
import crypto from "crypto";
import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "hotmail",
  auth: {
    user: HOTMAIL_USER,
    pass: HOTMAIL_PASSWORD,
  },
});

const authController = {
  resetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const foundUser = await User.findOne({ email: req.body.email });
      if (!foundUser) {
        const err = new CustomError(
          404,
          "User with such an email was not found."
        );
        throw err;
      }
      crypto.randomBytes(12, async (err, buffer) => {
        if (err) {
          throw err;
        } else {
          const token = buffer.toString("hex");
          await foundUser.updateOne(
            { email: req.body.email },
            {
              resetToken: token,
              resetTokenExpiresIn: Date.now() + 3600000,
            }
          );
          await transporter.sendMail({
            to: req.body.email,
            from: HOTMAIL_USER,
            subject: "Reset password - social-media-ts",
            html: `
            <h2>Reset password</h2>
            <br/>
            <p>Did you lose your documents? Again? No problem, we're here to assist you receive new ones. Just go there: <a href="http://localhost:3000/reset/${token}">Reset your password</a></p>
            <br/>
            <hr/>
            <br/>
            <p>If you received this email by mistake and don't understand what's going on just forget it like a nightmare.</p>`,
          });
          res.status(200).json({
            message:
              "Email was sent successfully. Please, don't forget to check your spam folder. It could be sent there by mistake.",
          });
        }
      });
    } catch (err) {
      if (err instanceof Error) {
        const error = new CustomError(500, err.message);
        next(error);
      }
      next(err);
    }
  },
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
        setTimeout(() => {
          res.status(201).json({ message: "User created successfully." });
        }, 4000);
      } catch (err: any) {
        const error = new CustomError(500, err.message);
        throw error;
      }
    } else {
      const err = new CustomError(422, errors.array()[0].msg);
      setTimeout(() => {
        next(err);
      }, 4000);
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
