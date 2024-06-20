import express, { Request, Response } from "express";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import upload from "../middlewares/multerMid.js";
import { addProductController } from "../controllers/adminController.js";
const router = express.Router();

router
  .route("/addproduct")
  .post(adminMiddleware,upload.single("image"),addProductController);

export default router;
