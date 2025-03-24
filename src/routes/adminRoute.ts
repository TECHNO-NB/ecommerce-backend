import express, { Request, Response } from "express";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import upload from "../middlewares/multerMid.js";
import { addProductController, allOrders, allProducts, getAllUsers } from "../controllers/adminController.js";
const router = express.Router();

router
  .route("/addproduct")
  .post(adminMiddleware,upload.single("image"),addProductController);

  router
  .route("/getallusers")
  .get(adminMiddleware,getAllUsers);

  router
  .route("/getallproducts")
  .get(adminMiddleware,allProducts);

  router
  .route("/getallorders")
  .get(adminMiddleware,allOrders);

export default router;
