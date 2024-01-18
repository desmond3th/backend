import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


/*** Route handler for toggling like on a video ***/
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    try {
            const existingLike = await Like.findOneAndDelete({ video: videoId, likedBy: req.user._id })
        
            if (!existingLike) {
                await Like.create({ video: videoId, likedBy: req.user._id })
            }
        
            const likeCount = await Like.countDocuments({ video: videoId }).lean()
        
            return res.status(200).json(
                new ApiResponse(200, {
                    likeCount : likeCount.toString(), 
                    userLiked: existingLike !== null 
                }, "Video like status updated successfully")
            )
    } catch (error) {
        throw new ApiError(400, "Failed to toggle like status for video") 
    }

})


/*** Route handler for toggling like on a comment ***/
const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    if(!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    try {
            const existingLike = await Like.findOneAndDelete({ comment: commentId, likedBy: req.user._id })
        
            if (!existingLike) {
                await Like.create({ comment: commentId, likedBy: req.user._id })
            }
        
            const likeCount = await Like.countDocuments({ comment: commentId }).lean()
        
            return res.status(200).json(
                new ApiResponse(200, {
                    likeCount : likeCount.toString(), 
                    userLiked: existingLike !== null 
                }, "Comment like status updated successfully")
            )
    } catch (error) {
        throw new ApiError(400, "Failed to toggle like status for comment")   
    }
})


export {
    toggleVideoLike,
    toggleCommentLike}