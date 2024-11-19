import asyncHandler from "../utils/asyncHandler.js";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import ApiError from "../utils/apiError.js";
import Order from "../models/orderModel.js";
uuidv4();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const paymentControllers = asyncHandler(async (req, res) => {
    const { price, products } = req.body;
    if (!price || !products || !Array.isArray(products)) {
        console.log("Invalid request data", 400);
    }
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: products.map((product) => ({
                price_data: {
                    currency: "usd",
                    unit_amount: product.price * 100,
                    product_data: {
                        name: product.product,
                        description: product.description,
                        images: [product.image],
                    },
                },
                quantity: 1,
            })),
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });
        if (!session) {
            throw new ApiError(400, "Failed to create checkout session");
        }
        const saved = products.forEach(async (element) => {
            const order = await Order.create({
                product: element._id,
                quantity: 10,
                user: req?.user.id,
            });
        });
        if (!saved) {
            throw new ApiError(400, "Failed to create order");
        }
        return res.status(200).json({ id: session.id, url: session.url });
    }
    catch (error) {
        console.log(`Stripe error: ${error}`, 500);
    }
});
export { paymentControllers };
