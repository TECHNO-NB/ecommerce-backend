import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import Order from "../models/orderModel.js";
const paymentControllers = asyncHandler(async (req, res) => {
    const { price, products } = req.body;
    console.log(price, products);
    if (!price || !products || !Array.isArray(products)) {
        console.log("Invalid request data", 400);
    }
    const saved = products.forEach(async (element) => {
        const order = await Order.create({
            product: element._id,
            quantity: 1,
            user: req?.user.id,
        });
        if (!order) {
            throw new ApiError(400, "Failed to create order");
        }
    });
    return res.status(201).json({ message: "Order created successfully" });
});
export { paymentControllers };
