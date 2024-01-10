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

// Extracting publicId from Cloudinary URL
const extractPublicIdFromUrl = (resourceUrl) => {
    try {
        const pathParts = resourceUrl.split('/');

        // Find the index of 'upload' in the path
        const uploadIndex = pathParts.indexOf('upload');

        if (uploadIndex !== -1 && uploadIndex < pathParts.length - 1) {
            // remove the 'upload' component and the version
            const publicIdParts = pathParts.slice(uploadIndex + 1, -1);

            // join the remaining parts to form the publicId and remove extension
            const publicId = publicIdParts.join('/').replace(/\.[^/.]+$/, '');

            return publicId;
        }
        
        return null;
    } catch (error) {
        return null;
    }
};



// deleting files on cloudinary
const cloudinaryDelete = async (resourceUrl) => {
    if (resourceUrl) {
        try {

            const publicId = extractPublicIdFromUrl(resourceUrl);
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