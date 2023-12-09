import { asyncHandler } from "../utils/asyncHandler.js"; 
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {cloudinaryUpload} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


// Defining a route handler for registering a user wrapped with error handling
const regUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validate the input 
    // check if user already exists
    // check for images and avatar
    // upload both to cloudinary
    // create user object (entry in db)
    // remove refresh token and password from reponse
    // check if user created
    // return respone


    // Destructuring values from request body
    const { fullname, email, username, password } = req.body;

    const fields = [fullname, email, username, password];
    
    // Checking for empty fields and throw error
    for (const field of fields) {
        if (!field || !field.trim()) {
            throw new ApiError(400, "Empty fields are not acceptable");
        }
    }
    
    // Checking if a user already exists with the provided email or username
    const existingUserByEmail = await User.findOne({ email });
    const existingUserByUsername = await User.findOne({ username });
    
    if (existingUserByEmail || existingUserByUsername) {
        throw new ApiError(409, "User already exists");
    }
    

    // handle the avatar and coverImage
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }
    


    //upload both on cloudinary
    const avatar = await cloudinaryUpload(avatarLocalPath)
    const coverImage = await cloudinaryUpload(coverImageLocalPath)

        // Use coverImageLocalPath if uploaded, otherwise use a null value
    const finalCoverImage = coverImage ?? "";


    if(!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }


    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: finalCoverImage,
        username : username.toLowerCase(),
        password,
    }
    )

    //search for user and remove passowrd and refresh token
    const checkForUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    id(!checkForUser){
        throw new ApiError(500, "Couldn't register the user");
    }

    return res.status(201).json(
        new ApiResponse(200, checkForUser, "User successfully registered!")
    )
    
})

export { regUser }  