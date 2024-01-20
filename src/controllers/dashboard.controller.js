import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


/*** Route handler for getting channel stats ***/
const getChannelStats = asyncHandler(async (req, res) => {

    const totalSubs = await Subscription.aggregate([
        {
            $match: { channel : mongoose.Types.ObjectId(req.user._id) },
        },
        {
            $group : {
                _id : '$channel',
                subscribersCount : {
                    $sum : 1
                }
            },
        },
    ])

    const totalViewsAndTotalVideos = await Video.aggregate([
        {
            $match : { owner : mongoose.Types.ObjectId(req.user._id) },
        },
        {
            $group : {
                _id : '$owner',
                totalViews : {
                    $sum : '$views'
                },
                totalVideos : {
                    $sum : 1
                },
            },
        },
    ])

    const totalLikes = await Like.aggregate([
        {
            $match: { likedBy : mongoose.Types.ObjectId(req.user._id) },
        },
        {
            $group : {
                _id : null,
                likesCount : {
                    $sum : 1
                },
            },
        },
    ])

    if(totalViewsAndTotalVideos.length === 0) {
        return res.status(200)
        .json(
            new ApiResponse(200, {}, "No videos are there on this channel") )
    }

    const channelStats = {
        totalSubs: totalSubs[0]?.subscribersCount || 0,
        totalViews: totalViewsAndTotalVideos[0]?.totalViews || 0,
        totalVideos: totalViewsAndTotalVideos[0]?.totalVideos || 0,
        totalLikes: totalLikes[0]?.likesCount || 0,
    }

    return res.status(200)
    .json(
        new ApiResponse(201, channelStats, "Channel Stats fetched successfully")
    )

})

export {
    getChannelStats,}