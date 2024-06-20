import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import Product from "../models/productModel.js";
import ApiResponse from "../utils/apiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
const addProductController = asyncHandler(async (req, res) => {
    const { product, description, price, stock, category, rating } = req.body;
    const filePath = req.file?.path;
    if (!product || !description || !price || !stock || !category || !rating) {
        throw new ApiError(400, "Fill all the required fields");
    }
    if (!filePath) {
        throw new ApiError(400, "FilePath is  required");
    }
    const filePathFromCloudinary = await uploadOnCloudinary(filePath);
    if (!filePathFromCloudinary) {
        throw new ApiError(500, "Error On Saving Pic In Cloudinary");
    }
    const productAdd = await Product.create({
        product,
        description,
        price,
        stock,
        category,
        rating,
        image: filePathFromCloudinary?.url,
    });
    if (!productAdd) {
        throw new ApiError(400, "Error On ProductsAdd");
    }
    res
        .status(201)
        .json(new ApiResponse(201, productAdd, "Product Added SuccessFully"));
});
const deleteOneProductController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "Product Id is required");
    }
    const productDelete = await Product.findByIdAndDelete(id);
    if (!productDelete) {
        throw new ApiError(404, "Product Not Found");
    }
    res
        .status(200)
        .json(new ApiResponse(200, productDelete, "Product Delete SuccessFully"));
});
const deleteallProductsController = asyncHandler(async (req, res) => {
    const allProductDelete = await Product.deleteMany();
    if (!allProductDelete) {
        throw new ApiError(404, "No Products Found");
    }
    res
        .status(200)
        .json(new ApiResponse(200, allProductDelete, "All Products Delete SuccessFully"));
});
export { addProductController, deleteOneProductController, deleteallProductsController, };
