import asyncHandler from "../utils/asyncHandler.js";
import { Request, Response } from "express";
import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Jwt } from "jsonwebtoken";

interface IUser {
 fullName: string;
 email: string;
 password: string;
 role?: string;
}

const userController = asyncHandler(async (req: Request, res: Response) => {
 const { fullName, email, password, role } = req.body as IUser;
 if (!fullName || !email || !password) {
  throw new ApiError(400, "Please Fill All Required Field");
 }

 const alreadyRegistredUser = await User.findOne({ email: email });
 if (alreadyRegistredUser) {
  throw new ApiError(400, "User Already Registered");
 }

 const user = await User.create<IUser>({
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

const userLoginController = asyncHandler(
 async (req: Request, res: Response) => {
  const { email, password } = req.body as Pick<IUser, "email" | "password">;
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
   domain: "ecommerce-frontend-phi.vercel.app",

   httpOnly: true,
   secure: true,
   sameSite: "none" as const,
  };

  res.cookie("accessToken", generateAccessToken, options);

  const loginUser = await User.findById(user._id).select("-password");
  res
   .status(200)
   .json(
    new ApiResponse(
     200,
     { user: loginUser, accessToken: generateAccessToken },
     "User Login SuccessFully:)"
    )
   );
 }
);

const reverifyUser = asyncHandler(async (req: Request, res: Response) => {
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
  path: "/",
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
 };

 res.cookie("accessToken", generateAccessToken, options);

 res
  .status(200)
  .json(
   new ApiResponse(
    200,
    { user: verifiedUser, accessToken: generateAccessToken },
    "Verify User SuccessFully:)"
   )
  );
});

const googleLoginController = asyncHandler(
 async (req: Request, res: Response) => {
  const { fullName, email, password, role } = req.body as IUser;

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
   };

   res
    .status(200)
    .cookie("accessToken", generateAccessToken, options)
    .json(
     new ApiResponse(
      200,
      { user: alreadyRegistredUser, accessToken: generateAccessToken },
      "User Login SuccessFully:)"
     )
    );
  }

  const user = await User.create<IUser>({
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
   domain: "ecommerce-frontend-phi.vercel.app",
   httpOnly: true,
   secure: true,
   sameSite: "none" as const,
  };

  res.cookie("accessToken", generateAccessToken, options);
  res
   .status(200)
   .json(
    new ApiResponse(
     200,
     { user: newUser, accessToken: generateAccessToken },
     "User Login SuccessFully:)"
    )
   );
 }
);

export {
 userController,
 userLoginController,
 reverifyUser,
 googleLoginController,
};
