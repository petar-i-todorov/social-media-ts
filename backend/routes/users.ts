import { Router } from "express";
import { userController } from "../controllers/userController";

const router = Router();

router.get("/:userId", userController.getUser);

export default router;
