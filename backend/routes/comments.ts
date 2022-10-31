import { Router } from "express";
import { feedController } from "../controllers/feedController";
import { isAuth } from "../middlewares/is-auth";

const router = Router();

router.patch("/:commentId/like", isAuth, feedController.likeComment);
router.patch("/:commentId/dislike", isAuth, feedController.dislikeComment);

export default router;
