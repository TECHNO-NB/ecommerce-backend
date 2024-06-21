import express from "express";
import { googleLoginController, reverifyUser, userController, userLoginController } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();
router.route("/register").post(userController);
router.route("/login").post(userLoginController);
router.route("/googlelogin").post(googleLoginController);
router.route("/reverifyuser").post(authMiddleware, reverifyUser);
export default router;
