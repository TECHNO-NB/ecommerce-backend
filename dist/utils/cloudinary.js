import cloudinary from "cloudinary";
import fs from "fs";
cloudinary.v2.config({
    cloud_name: "nareshnb",
    api_key: "149319974277394",
    api_secret: "rXa-c4twfIuspAZ1lTBez8-ed00",
});
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath)
            return null;
        const response = await cloudinary.v2.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        fs.unlinkSync(localFilePath);
        return response;
    }
    catch (error) {
        console.log("cloudinaryError", error);
        fs.unlinkSync(localFilePath);
    }
};
export default uploadOnCloudinary;
