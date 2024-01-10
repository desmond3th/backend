import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "src/models/video.model.js"
import {User} from "src/models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {cloudinaryUpload} from "../utils/cloudinaryUpload.js"


const publishVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body


})


export {
    publishVideo
}