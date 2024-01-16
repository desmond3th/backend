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

export {
    createPlaylist,}