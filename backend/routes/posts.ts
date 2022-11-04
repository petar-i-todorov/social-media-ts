import { Router } from "express";
import { feedController } from "../controllers/feedController";
import { body } from "express-validator";
import { isAuth } from "../middlewares/is-auth";
import { BACKEND, DEVOPS, FRONTEND } from "../constants/feed";

const router = Router();

router.get("/", feedController.getPosts);
router.post(
  "/new",
  body("title")
    .isLength({ min: 5, max: 50 })
    .withMessage("Invalid title. Allowed length is between 5 and 50 symbols."),
  body("description")
    .isLength({ min: 20, max: 1000 })
    .withMessage(
      "Invalid description. Allowed length is between 20 and 1000 symbols."
    ),
  body("platform").custom((value) => {
    if (
      value === "REDDIT" ||
      value === "GITHUB" ||
      value === "LINKEDIN" ||
      value === "FACEBOOK" ||
      value === "UDEMY" ||
      value === "STACKOVERFLOW" ||
      value === "OTHER"
    ) {
      return true;
    }
    throw new Error("Invalid platform.");
  }),
  body("devRole").custom((value) => {
    if (value === FRONTEND || value === BACKEND || value === DEVOPS) {
      return true;
    }
    throw new Error("Invalid dev role.");
  }),
  body("url").isURL().withMessage("Invalid URL."),
  feedController.createPost
);
router.patch("/upvote/:postId", isAuth, feedController.upvotePost);
router.patch("/downvote/:postId", isAuth, feedController.downvotePost);
router.delete("/:postId", isAuth, feedController.deletePost);
router.post("/report/:postId", isAuth, feedController.reportPost);
router.get("/:postId", feedController.getPost);
router.patch("/:postId", isAuth, feedController.editPost);
router.post("/addComment/:postId", isAuth, feedController.addComment);

export default router;
