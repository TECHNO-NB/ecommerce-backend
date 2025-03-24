import Product from "../models/productModel.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
const productSortingControllers = asyncHandler(async (req, res) => {
    const { category = "all", price = Infinity, time = "latest", limit = 10, } = req.query;
    const filters = {};
    if (category !== "all" && category !== "") {
        filters.category = category;
    }
    // Add price filter if price is provided and valid
    const priceValue = Number(price);
    if (!isNaN(priceValue) && priceValue !== Infinity) {
        filters.price = { $gt: priceValue };
    }
    const timeSort = time === "old" ? 1 : -1;
    const products = await Product.find(filters)
        .sort({ createdAt: timeSort })
        .limit(Number(limit));
    res.status(200).json(products);
});
const getSingleProductControllers = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "Id is required");
    }
    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    return res.status(200).json(product);
});
export { productSortingControllers, getSingleProductControllers };
