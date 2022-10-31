import { Router } from "express";
import { userController } from "../controllers/userController";

const router = Router();

router.get("/:userId", userController.getUser);
router.patch("/:userId/updateQuote", userController.updateQuote);

export default router;
