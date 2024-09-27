import Product from "../models/productModel.js";
import asyncHandler from "../utils/asyncHandler.js";

const productSortingControllers = asyncHandler(async (req, res) => {
 const {
  category = "all",
  price = Infinity,
  time = "latest",
  limit = 10,
 } = req.query;
 // Prepare filters
 const filters: any = {};

 // Add category filter only if a specific category is selected
 if (category !== "all" && category !== "") {
  filters.category = category;
 }

 // Add price filter if price is provided and valid
 const priceValue = Number(price);
 if (!isNaN(priceValue) && priceValue !== Infinity) {
  filters.price = { $gt: priceValue };
 }

 // Sorting logic: Sort by createdAt (latest or oldest)
 const timeSort = time === "old" ? 1 : -1;

 // Fetch products based on filters and sorting
 const products = await Product.find(filters)
  .sort({ createdAt: timeSort })
  .limit(Number(limit));

 // Respond with fetched products
 res.status(200).json(products);
});

export { productSortingControllers };
