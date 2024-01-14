import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


/*** Route handler for accessing all the comments of a video ***/
const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    }

    const comments = await Comment.aggregatePaginate([
        {
            $match: {video : mongoose.Types.ObjectId(videoId)}
        },
        {
            $lookup :{
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'ownerDetails',
            }
        },
        {
            $unwind: $ownerDetails
        },
        {
            $project : {
                content: 1,
                createdAt: 1,
                owner: {
                    username:1,
                    avatar: 1
                }
            }
        }
    ], options)

    return res.status(200)
    .json(
        new ApiResponse(200, comments.docs, "Comments successfully accessed")
    )
})

export {
    getVideoComments }