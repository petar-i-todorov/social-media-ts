import { Router } from "express";
import { feedController } from "../controllers/feedController";

const router = Router();

router.patch("/:commentId/like", feedController.likeComment);
router.patch("/:commentId/dislike", feedController.dislikeComment);

export default router;
