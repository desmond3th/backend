import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "src/models/video.model.js"
import {User} from "src/models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {cloudinaryUpload, cloudinaryDelete} from "../utils/cloudinaryUpload.js"


/*** Route handler for uploading video ***/
const publishVideo = asyncHandler(async (req, res) => {
    
    if (!req.files || !req.files.videoFile || !req.files.thumbnail) {
        throw new ApiError(400, "Both video file and thumbnail are required!");
    }
    
    const { title, description } = req.body;
    if (!title || !description) {
        throw new ApiError(400, "Both title and description are required!");
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


/*** Route handler for deleting video ***/
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const videoResult = await Video.findById(videoId)

    if(!videoResult){
        throw new ApiError(404, "Couldn't find video")
    }

    const videoURL = videoResult.videoFile; 

    const deletionResult = await cloudinaryDelete(videoURL);

    if(!deletionResult) {
        throw new ApiError(500, "Video deletion failed")
    }

    await Video.deleteOne({ _id: videoId });

    return res.status(200).json(
        new ApiResponse(200, null, "Video deleted successfully")
    )

})


/*** Route handler for accessing a video ***/
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const videoResult = await Video.findById(videoId)

    if (!videoResult) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(
        new ApiResponse(200, videoResult, "video fetched successfully")
    )
})


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const { title, description} = req.body

    const thumbnailFilePath = req.file?.path

    if (!thumbnailFilePath) {
        throw new ApiError(400, "Thumbnail file is required!");
    }

    const uploadThumbnail = await cloudinaryUpload(thumbnailFilePath);

    if (!uploadThumbnail || !uploadThumbnail.url) {
        throw new ApiError(500, "Thumbnail upload failed!");
    } 

    const video = await Video.findByIdAndUpdate(videoId,
        {
            $set: {
                title: title,
                thumbnail: uploadThumbnail.url,
                description: description
            }
        }, {new: true})

    return res.status(200)
    .json( 
        new ApiResponse(200, video, "Video updated successfully")
    ) 
})

export {
    publishVideo, 
    deleteVideo, 
    getVideoById,
    updateVideo
}