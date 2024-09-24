import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
const userController = asyncHandler(async (req, res) => {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password) {
        throw new ApiError(400, "Please Fill All Required Field");
    }
    const alreadyRegistredUser = await User.findOne({ email: email });
    if (alreadyRegistredUser) {
        throw new ApiError(400, "User Already Registered");
    }
    const user = await User.create({
        fullName,
        email,
        password,
        role,
    });
    if (!user) {
        throw new ApiError(500, "Error On Register User");
    }
    res
        .status(200)
        .json(new ApiResponse(201, user, "User Registered SuccessFully:)"));
});
const userLoginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Please Fill All Required Field");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid Password");
    }
    const generateAccessToken = await user.createAccessToken();
    if (!generateAccessToken) {
        throw new ApiError(500, "Error On Generating Token");
    }
    const options = {
        httpOnly: true,
        secure: true,
        maxAge: 5 * 24 * 60 * 60 * 1000,
        sameSite: 'None'
    };
    const loginUser = await User.findById(user._id).select("-password");
    res
        .status(200)
        .cookie("accessToken", generateAccessToken, options)
        .json(new ApiResponse(200, { user: loginUser, accessToken: generateAccessToken }, "User Login SuccessFully:)"));
});
const reverifyUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized Access");
    }
    const verifiedUser = await User.findById(user._id).select("-password");
    if (!verifiedUser) {
        throw new ApiError(404, "User Not Found");
    }
    const generateAccessToken = await verifiedUser.createAccessToken();
    if (!generateAccessToken) {
        throw new ApiError(500, "Error On Generating Token");
    }
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 5 * 24 * 60 * 60 * 1000,
    };
    res
        .status(200)
        .cookie("accessToken", generateAccessToken, options)
        .json(new ApiResponse(200, { user: verifiedUser, accessToken: generateAccessToken }, "Verify User SuccessFully:)"));
});
const googleLoginController = asyncHandler(async (req, res) => {
    const { fullName, email, password, role } = req.body;
    const createPassword = email + password + Date.now() + 1000;
    if (!fullName || !email || !password) {
        throw new ApiError(400, "Please Fill All Required Field");
    }
    const alreadyRegistredUser = await User.findOne({ email: email });
    if (alreadyRegistredUser) {
        const generateAccessToken = await alreadyRegistredUser.createAccessToken();
        if (!generateAccessToken) {
            throw new ApiError(500, "Error On Generating Token");
        }
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 5 * 24 * 60 * 60 * 1000,
        };
        res
            .status(200)
            .cookie("accessToken", generateAccessToken, options)
            .json(new ApiResponse(200, { user: alreadyRegistredUser, accessToken: generateAccessToken }, "User Login SuccessFully:)"));
    }
    else {
        const user = await User.create({
            fullName,
            email,
            password: createPassword,
            role,
        });
        if (!user) {
            throw new ApiError(500, "Error On Register User");
        }
        const newUser = await User.findOne({ email });
        if (!newUser) {
            throw new ApiError(500, "Error On Register User");
        }
        const generateAccessToken = await newUser.createAccessToken();
        if (!generateAccessToken) {
            throw new ApiError(500, "Error On Generating Token");
        }
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 5 * 24 * 60 * 60 * 1000,
        };
        res
            .status(200)
            .cookie("accessToken", generateAccessToken, options)
            .json(new ApiResponse(200, { user: newUser, accessToken: generateAccessToken }, "User Login SuccessFully:)"));
    }
});
const logOutUser = asyncHandler(async (req, res) => {
    res.clearCookie("accessToken");
    return res.status(200).send("Logged out successfully.");
});
export { userController, userLoginController, reverifyUser, googleLoginController, logOutUser, };
