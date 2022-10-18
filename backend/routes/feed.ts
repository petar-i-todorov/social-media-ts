import { Router } from "express";
import { feedController } from "../controllers/feedController";

const router = Router();

router.post("/new", feedController.createPost);

export default router;
