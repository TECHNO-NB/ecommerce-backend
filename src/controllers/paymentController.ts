import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import Stripe from "stripe";
import ApiError from "../utils/apiError.js"; // Assuming you want to use this for error handling
import { v4 as uuidv4 } from "uuid";
uuidv4();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const paymentControllers = asyncHandler(async (req: Request, res: Response) => {
 const { price, products } = req.body;

 if (!price || !products || !Array.isArray(products)) {
  console.log("Invalid request data", 400);
 }

 try {
  const session = await stripe.checkout.sessions.create({
   payment_method_types: ["card"],
   line_items: products.map((product: any) => ({
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

  // Send the session URL back to the client
  res.status(200).json({ id: session.id, url: session.url });
 } catch (error) {
  console.log(`Stripe error: ${error}`, 500);
 }
});

export { paymentControllers };
