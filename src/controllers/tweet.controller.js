import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


/*** Route handler for creating a tweet ***/
const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body
    const userID = req.user._id

    const user = await User.findById(userID)

    if(!user) {
        throw new ApiError(400, "You are not authorized to post a tweet") 
    }

    const tweet = await Tweet.create({
        content,
        owner: userID
    })

    return res.status(200).json(
        new ApiResponse(200, tweet, "Tweet created successfully")
    )

})


export {
    createTweet }

