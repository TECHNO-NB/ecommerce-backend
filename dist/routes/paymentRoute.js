import express from "express";
import { paymentControllers } from "../controllers/paymentController.js";
const router = express.Router();
router.route("/payment").post(paymentControllers);
export default router;
