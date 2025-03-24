import mongoose from "mongoose";
import { IProducts } from "../types/types.js";

const productSchema = new mongoose.Schema<IProducts>(
  {
    product: {
      type: String,
      required: true,
      index: 1,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProducts>("Product", productSchema);

export default Product;
