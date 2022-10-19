import { Router } from "express";
import { feedController } from "../controllers/feedController";
import { body } from "express-validator";
import { devRole, platform } from "../constants/feedConsts";

const router = Router();

router.get("/", feedController.getPosts);
router.post(
  "/new",
  body("title").isLength({ min: 5, max: 50 }).isAlphanumeric(),
  body("description").isLength({ min: 20, max: 1000 }),
  body("platform").custom((value) => {
    if (value !== platform) {
      throw new Error("Invalid platform.");
    }
    return true;
  }),
  body("devRole").custom((value) => {
    if (value !== devRole) {
      throw new Error("Invalid dev role.");
    }
    return true;
  }),
  body("url").isURL(),
  feedController.createPost
);
router.patch("/upvote/:postId", feedController.upvotePost);
router.patch("/downvote/:postId", feedController.downvotePost);

export default router;
