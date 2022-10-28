import { Router } from "express";
import { feedController } from "../controllers/feedController";

const router = Router();

router.patch("/:commentId/like", feedController.likeComment);

export default router;
