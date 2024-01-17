import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


/*** Route handler for creating a playlist ***/
const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!name || !description) {
        throw new ApiError(400, "Both the fileds are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner : req.user._id
    })

    return res.status(200)
    .json(
        new ApiResponse(200, playlist , "Playlist created successfully")
    )
})


/*** Route handler for adding video to a playlist ***/
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    const video = await Playlist.findById(videoId);

    if(!video) {
        throw new ApiError(400, "video not found")
    }

    const playlist = await Playlist.findByIdAndUpdate( playlistId, 
        {
            $push: {videos: videoId}
        }, 
        {new : true} 
    )

    return res.status(200)
    .json(
        new ApiResponse(200, playlist, "Video added to the playlist")
    )
})


/*** Route handler for removing video from playlist ***/
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid id");
    }

    const playlist = await Playlist.findByIdAndUpdate( playlistId,
        {
            $pull : {videos: videoId}
        },
        {new : true}
    )

    return res.status(200)
    .json(
        new ApiResponse(200, playlist, "video removed from playlist")
    )
})


/*** Route handler for updating the playlist ***/
const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    if(!name || !description) {
        throw new ApiError(400, "name or description is required")
    }

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findByIdAndUpdate( playlistId, 
        {
            $set : {
                name,
                description
            }
        },
        {new : true}
    )

    return res.status(200)
    .json(
        new ApiResponse(200, playlist, "updated playlist")
    )
})


export {
    createPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist,}