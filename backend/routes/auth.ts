import { Router } from "express";
import authController from "../controllers/authController";
import { body } from "express-validator";
import CustomError from "../types/Error";
import User from "../models/user";

const router = Router();

router.post(
  "/signup",
  body("name").isLength({ min: 3, max: 30 }),
  body("email")
    .normalizeEmail()
    .isEmail()
    .custom(async (value) => {
      try {
        const user = await User.find({ email: value });
        if (user.length !== 0) {
          const err = new CustomError(
            422,
            "User with this email already exists."
          );
          throw err;
        } else {
          return true;
        }
      } catch (err: any) {
        const error = new CustomError(500, err.message);
        throw error;
      }
    }),
  body("password").isLength({ min: 10 }),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      const err = new CustomError(422, "Password doesn't match.");
      throw err;
    } else {
      return true;
    }
  }),
  authController.signup
);

export default router;
