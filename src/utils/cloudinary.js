import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// uploading files on cloudinary
const cloudinaryUpload = async (localPath) => {
    try{
        if(!localPath) return null;

        const response = await cloudinary.uploader.upload( localPath, {resource_type: "auto"} )
        console.log("file has been uploaded on cloudinary", response.url)
        
        return response;

    } catch (err) {
        fs.unlinkSync(localPath) // remove locally saved temp file cuz uploading failed
        return null;
    }
}


// testing 

const uploadFileToCloudinary = async (localPath) => {
    if (!localPath) {
        console.error("Local path is missing.");
        return null;
    }

    try {
        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localPath, { resource_type: "auto" });

        // Log success message with Cloudinary URL
        console.log("File successfully uploaded to Cloudinary:", response.url);

        // Return the Cloudinary response
        return response;

    } catch (uploadError) {
        // Handle upload error
        console.error("Error uploading file to Cloudinary:", uploadError);

        try {
            // Remove locally saved temp file if an error occurs during upload
            fs.unlinkSync(localPath);
            console.log("Local temp file removed.");
        } catch (unlinkError) {
            // Handle error during local file removal
            console.error("Error removing local temp file:", unlinkError);
        }

        // Return null to indicate failure
        return null;
    }
};

// Example usage:
const localFilePath = "/path/to/local/file.jpg";
uploadFileToCloudinary(localFilePath);



export { cloudinaryUpload }