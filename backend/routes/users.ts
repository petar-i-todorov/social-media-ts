import { Router } from "express";
import { userController } from "../controllers/userController";
import { isAuth } from "../middlewares/is-auth";

const router = Router();

router.get("/:userId", userController.getUser);
router.get("/:userId/posts", userController.getUserPosts);
router.patch("/:userId/updateQuote", isAuth, userController.updateQuote);
router.patch("/:userId/updateAvatar", isAuth, userController.updateAvatar);
router.get("/:userId/avatar", userController.getAvatar);

export default router;
