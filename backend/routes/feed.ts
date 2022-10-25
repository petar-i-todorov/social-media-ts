import { Router } from "express";
import { feedController } from "../controllers/feedController";
import { body } from "express-validator";

const router = Router();

router.get("/", feedController.getPosts);
router.post(
  "/new",
  body("title")
    .isLength({ min: 5, max: 50 })
    .withMessage("Invalid title. Allowed length is between 5 and 50 symbols.")
    .isAlphanumeric()
    .withMessage("Invalid title. Only alphanumeric symbols are allowed."),
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
    if (value === "Frontend" || value === "Backend" || value === "DevOps") {
      return true;
    }
    throw new Error("Invalid dev role.");
  }),
  body("url").isURL().withMessage("Invalid URL."),
  feedController.createPost
);
router.patch("/upvote/:postId", feedController.upvotePost);
router.patch("/downvote/:postId", feedController.downvotePost);
router.delete("/delete/:postId", feedController.deletePost);
router.post("/report/:postId", feedController.reportPost);
router.get("/:postId", feedController.getPost);
router.patch("/:postId", feedController.editPost);

export default router;
