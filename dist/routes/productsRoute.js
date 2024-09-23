import express from "express";
import Product from "../models/productModel.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { deleteOneProductController, deleteallProductsController, } from "../controllers/adminController.js";
import { productSortingControllers } from "../controllers/productControllers.js";
const router = express.Router();
router.route("/getallproducts").get(async (req, res) => {
    try {
        const allProducts = await Product.find({}).sort({ createdAt: -1 });
        if (!allProducts) {
            throw new ApiError(500, "Error on fetch all products");
        }
        res
            .status(200)
            .json(new ApiResponse(200, allProducts, "All Products Get SuccessFully"));
    }
    catch (error) {
        console.log(error);
    }
});
router
    .route("/deleteoneproduct/:id")
    .delete(adminMiddleware, deleteOneProductController);
router
    .route("/deleteallproducts")
    .delete(adminMiddleware, deleteallProductsController);
router.route("/search-sort").get(productSortingControllers);
export default router;
