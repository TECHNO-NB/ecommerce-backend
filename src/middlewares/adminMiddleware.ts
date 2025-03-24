import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

interface JwtPayload {
 _id: string;
}

type TUser =
 "Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>";
const adminMiddleware = asyncHandler(async (req, res, next) => {
 const token =
  req.cookies?.accessToken ||
  req.headers?.authorization?.replace("Bearer ", "");

 console.log(token);
 if (!token) return res.status(401).json({ message: "Unauthorized" });

 let authorize: JwtPayload | null = null;

 try {
  authorize = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
 } catch (err) {
  throw new ApiError(401, "Unauthorized");
 }

 if (!authorize || !authorize._id) {
  throw new ApiError(401, "Unauthorized");
 }

 const user = await User.findById({ _id: authorize._id }).select("-password");

 if (!user) {
  throw new ApiError(401, "Unauthorized");
 }

 if (user.role !== "admin") {
  throw new ApiError(401, "Unauthorized");
 }

 if (user.role === "admin") {
  req.user = user;
  next();
 } else {
  throw new ApiError(401, "Unauthorized");
 }
});

export default adminMiddleware;
