import Order from "../models/orderModel.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
const getOrdersDetails = asyncHandler(async (req, res) => {
    console.log("Server hit for fetching orders");
    console.log(`User ID: ${req.user._id}`);
    // Fetch all orders for the logged-in user
    const allOrders = await Order.find({ user: req.user._id }).populate("product");
    console.log(allOrders);
    if (!allOrders || allOrders.length === 0) {
        throw new ApiError(404, "No orders found for this user.");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, allOrders, "All orders retrieved successfully."));
});
export { getOrdersDetails };
