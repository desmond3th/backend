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
            // console.log('Local file deleted successfully.');
        } catch (deleteErr) {
            // console.error('Error deleting local file:', deleteErr);
        }

        return null;
    }
};

// deleting files on cloudinary
const cloudinaryDelete = async (oldImageUrl) => {
    if (oldImageUrl) {
        try {
            // Delete the old image from Cloudinary using the URL
            const deletionResult = await cloudinary.uploader.destroy(oldImageUrl);
           console.log(deletionResult)

            if (deletionResult.result !== 'ok') {
                return false;
            }

            // If the deletion was successful
            // console.log("Old image deleted successfully:", oldImageUrl);
            return true;
        } catch (error) {
            return false;
        }
    }

    // If no old image URL is provided, consider it as successfully deleted
    return true;
};



export { cloudinaryUpload, cloudinaryDelete }