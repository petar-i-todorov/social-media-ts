import { Router } from "express";
import { userController } from "../controllers/userController";
import { isAuth } from "../middlewares/is-auth";

const router = Router();

router.get("/:userId", userController.getUser);
router.patch("/:userId/updateQuote", isAuth, userController.updateQuote);

export default router;
