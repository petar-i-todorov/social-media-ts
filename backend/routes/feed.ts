import { Router } from "express";
import { feedController } from "../controllers/feedController";

const router = Router();

router.post("/new", feedController.createPost);
router.get("", feedController.getPosts);
router.patch("/upvote/:postId", feedController.upvotePost);
router.patch("/downvote/:postId", feedController.downvotePost);

export default router;
