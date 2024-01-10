import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "src/models/video.model.js"
import {User} from "src/models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {cloudinaryUpload} from "../utils/cloudinaryUpload.js"


/*** Route handler for uploading video ***/
const publishVideo = asyncHandler(async (req, res) => {
    
    if (!req.files || !req.files.videoFile || !req.files.thumbnail) {
        throw new ApiError(400, "Both video file and thumbnail are required!");
    }

    // For Video
    const videoFilePath = req.files.videoFile[0]?.path;

    if (!videoFilePath) {
        throw new ApiError(400, "Video file is required!");
    }

    const videoCloudinaryResponse = await cloudinaryUpload(videoFilePath);
   //  console.log(videoCloudinaryResponse)

    if (!videoCloudinaryResponse.url) {
        throw new ApiError(500, "Video upload failed!");
    }

    // For Thumbnail
    const thumbnailFilePath = req.files.thumbnail[0]?.path;

    if (!thumbnailFilePath) {
        throw new ApiError(400, "Thumbnail file is required!");
    }
    
    const thumbnailCloudinaryResponse = await cloudinaryUpload(thumbnailFilePath);

    if (!thumbnailCloudinaryResponse || !thumbnailCloudinaryResponse.url) {
        await cloudinaryDelete(videoCloudinaryResponse.url);
        throw new ApiError(500, "Thumbnail upload failed!");
    } 

    // a new video document in the database
    const newVideo = new Video({
        videoFile: videoCloudinaryResponse.url,
        thumbnail: thumbnailCloudinaryResponse.url,
        description,
        title,
        duration: videoCloudinaryResponse?.info?.duration || 0,
        owner: req.user._id
    });

    const savedVideo = await newVideo.save();

    return res.status(201).json( 
        new ApiResponse(200, savedVideo, "Video published successfully"))

});


export {
    publishVideo
}