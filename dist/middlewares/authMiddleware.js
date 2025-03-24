import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken ||
        req.headers?.authorization?.replace("Bearer ", "");
    if (!token)
        return res.status(401).json({ message: "Unauthorized" });
    let authorize = null;
    try {
        authorize = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (err) {
        throw new ApiError(401, "Unauthorized");
    }
    if (!authorize || !authorize._id) {
        throw new ApiError(401, "Unauthorized");
    }
    const user = await User.findById({ _id: authorize._id }).select("-password");
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    req.user = user;
    next();
});
export default authMiddleware;
