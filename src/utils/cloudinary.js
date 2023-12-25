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
        if(!localPath)
            return null;

        const response = await cloudinary.uploader.upload( localPath, {resource_type: "auto"} )
        // console.log('File uploaded successfully:', response);
        fs.unlinkSync(localPath);

        return response;

    } catch (err) {
        // console.error('Error during Cloudinary upload:', err);

        try {
            fs.unlinkSync(localPath);
        } catch (deleteErr) {
            // console.error('Error deleting local file:', deleteErr);
        }

        return null;
    }
};

// Extracting publicId from cloudinary URL
const extractPublicIdFromUrl = (imageUrl) => {
    try {
        const pathParts = imageUrl.split('/upload/');
        if (pathParts.length === 2) {
            // Split the second part by '/' and exclude the first component (version)
            const publicIdParts = pathParts[1].split('/').slice(1);
            
            // Remove file extension (.jpg)
            const publicId = publicIdParts.join('/').replace(/\.[^/.]+$/, '');

            return publicId;
        }
        return null;
    } catch (error) {
        return null;
    }
};


// deleting files on cloudinary
const cloudinaryDelete = async (oldImageUrl) => {
    if (oldImageUrl) {
        try {

            const publicId = extractPublicIdFromUrl(oldImageUrl);
            //console.log("Public Id:",publicId)
            
            const deletionResult = await cloudinary.uploader.destroy(publicId);
            //console.log(deletionResult)

            if (deletionResult.result !== 'ok') {
                return false;
            }

            // If the deletion was successful
            return true;

        } catch (error) {
            return false;
        }
    }
    // If no old image URL is provided, consider it as successfully deleted
    return true;
};


export { cloudinaryUpload, cloudinaryDelete }