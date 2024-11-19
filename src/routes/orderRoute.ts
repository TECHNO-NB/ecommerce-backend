import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getOrdersDetails } from "../controllers/orderController.js";

const router = express.Router();

router.route("/getorderdetails").get(authMiddleware, getOrdersDetails);

export default router;
