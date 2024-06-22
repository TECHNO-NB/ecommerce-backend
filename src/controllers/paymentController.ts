import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import Stripe from "stripe";
import ApiError from "../utils/apiError.js";
import { v4 as uuidv4 } from "uuid";
uuidv4();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const paymentControllers = asyncHandler(async (req: Request, res: Response) => {
 const { price, token } = req.body;
 if (!price || !token) {
  throw new ApiError(400, "Some things is missing");
 }
 const idempotencyKey = uuidv4();
 return stripe.customers
  .create({
   email: token.email,
   source: token.id,
  })
  .then((customer) => {
   stripe.charges.create(
    {
     amount: price * 100,
     currency: "usd",
     receipt_email: token.email,
     description: "product purchase",
    },
    { idempotencyKey }
   );
  })
  .then((result) => {
   res.status(200).json({ success: true, message: result });
  })
  .catch((err:any) => console.log(err));
});

export { paymentControllers };
