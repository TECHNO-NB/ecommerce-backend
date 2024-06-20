import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
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
}, { timestamps: true });
const Product = mongoose.model("Product", productSchema);
export default Product;
