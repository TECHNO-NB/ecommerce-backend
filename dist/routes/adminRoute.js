import express from "express";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import upload from "../middlewares/multerMid.js";
import { addProductController, getAllUsers } from "../controllers/adminController.js";
const router = express.Router();
router
    .route("/addproduct")
    .post(adminMiddleware, upload.single("image"), addProductController);
router
    .route("/getallusers")
    .get(adminMiddleware, getAllUsers);
export default router;
