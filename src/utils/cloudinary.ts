import cloudinary from "cloudinary";
import fs from "fs";
import ApiError from "./apiError.js";

cloudinary.v2.config({
  cloud_name: "nareshnb",
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.v2.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.log("cloudinaryError", error);
    fs.unlinkSync(localFilePath);
  }
};

export default uploadOnCloudinary;
