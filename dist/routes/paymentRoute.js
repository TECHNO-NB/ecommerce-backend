import express from "express";
import { paymentControllers } from "../controllers/paymentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();
router.route("/payment").post(authMiddleware, paymentControllers);
export default router;
