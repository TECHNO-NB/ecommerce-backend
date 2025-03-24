import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import Product from "../models/productModel.js";
import ApiResponse from "../utils/apiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
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
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -email -createdAt");
    res.status(200).json(new ApiResponse(200, users, "All user fetched"));
});
const allProducts = asyncHandler(async (req, res) => {
    const getAllProducts = await Product.find().select("-description -category -image -rating -createdAt -stock -updatedAt");
    res.status(200).json(new ApiResponse(200, getAllProducts, "All products"));
});
const allOrders = asyncHandler(async (req, res) => {
    console.log("Hit server");
    const getAllOrders = await Order.find()
        .populate("user", "fullName")
        .select("-quantity -createdAt -product -updatedAt");
    console.log("get all products", getAllOrders);
    res.status(200).json(new ApiResponse(200, getAllOrders, "All products"));
});
export { addProductController, deleteOneProductController, deleteallProductsController, getAllUsers, allProducts, allOrders };
