import { asyncHandler } from "../utils/asyncHandler.js"; 
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {cloudinaryUpload} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


/** method for generating access and refresh token **/
const generateAccessAndRefreshTokens = async (userId) => {

    try{
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        
      //  console.log(accessToken, refreshToken)

        user.refreshToken = refreshToken
        await user.save( {validateBeforeSave : false} )

        return {accessToken, refreshToken}

    } catch(err){
        throw new ApiError(500, "Couldn't generate Acesss or Refresh token")
    }
}


/**** Defining a route handler for registering a user ****/
const regUser = asyncHandler( async (req, res) => {

    // Destructuring values from request body
    const { fullname, email, username, password } = req.body;

    const fields = [fullname, email, username, password];
    
    // Checking for empty fields and throw error i.e. validation
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
    const avatarLocalPath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required!");
    }
    
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    //upload both on cloudinary
    const avatar = await cloudinaryUpload(avatarLocalPath)
    // console.log('Avatar upload response:', avatar);

    const coverImage = await cloudinaryUpload(coverImageLocalPath)
    // console.log('Cover image upload response:', coverImage);

    if(!avatar) {
        throw new ApiError(400, "Avatar file upload failed!");
    }

    // create user object (entry in db)
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage:  coverImage?.url || "", // Use coverImageLocalPath if uploaded, otherwise use a null value
        username : username.toLowerCase(),
        password,
        email
    }
    )

    //search for user and remove passowrd and refresh token (excluding sensitive information)
    const checkForUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check if user is created
    if(!checkForUser){
        throw new ApiError(500, "Couldn't register the user");
    }

    //return respone
    return res.status(201).json(
        new ApiResponse(200, checkForUser, "User successfully registered!")
    )
    
})


/*** Defining a route handler for logging In a user ****/
const loginUser = asyncHandler(async (req, res) => {

    // get data from req body
    const {username, email, password} = req.body

    // login with username or email
    if(!email && !username) {
        throw new ApiError(400, "One of the field is required")
    }

    // search for the user
    const user =  await User.findOne({
        $or : [{username}, {email}]
    })

    if(!user) {
        throw new ApiError(402, "User doesn't exist")
    }

    // check for password
    const validPassword = await user.isPasswordCorrect(password)

    if(!validPassword) {
        throw new ApiError(403, "Password Incorrect")
    }

    // generate access and refresh token
    const {accessToken, refreshToken} = await 
    generateAccessAndRefreshTokens(user._id)

    const loggedUser = await User.findById(user._id).
    select("-password -refreshToken")

    // send these tokens in cookie
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )

})


/*** Route handler for logging Out a user ****/
const logoutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json( new ApiResponse(200, {}, "User Logged Out Successfully") )
})


/*** Route handler for refreshing the access token using a valid refresh token ****/
const refreshAccessToken = asyncHandler(async (req, res) => {

    // Extract refresh token from cookies or request body
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(402, "Invalid request")
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)

    if(!user){
        throw new ApiError(401, "Refresh Token Invalid")
    }

    // Check if the stored refresh token matches the incoming refresh token
    if(user?.refreshToken !== incomingRefreshToken){
        throw new ApiError(401, "Expired refresh token")
    }

    // Generate new access and refresh tokens for the user
    const [accessToken, newRefreshToken] = await generateAccessAndRefreshTokens(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    // Set the new access and refresh tokens as cookies in the response
    return res
    .statusCode = 200
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json( new ApiResponse(
        200,
        {
            accessToken, newRefreshToken
        },
        "Refresh token refreshed successfully"
    ) )

})


/***Route hanlder for changing password ***/
const changePassword = asyncHandler(async(req, res) => {

    const [oldPassword, newPassword] = req.body

    const user = await User.findById(req.user?._id)

    const validPassword = await user.isPasswordCorrect(oldPassword)

    if(!validPassword) {
        throw new ApiError(400, "Old password is incorrect")
    }

    user.passsword = newPassword
    await user.save({validateBeforeSave: false})

    return res.status(200).json(
        new ApiResponse(200, {}, "Password changed successfully")
    )
})


/***Route handler for getting current user ***/
const getCurrentUser = asyncHandler(async (req, res) => {

    return res.status(200).json(
        new ApiResponse(200, req.user, "User fetched successfully")
    )
})


export { loginUser,
        regUser,
        logoutUser, 
        refreshAccessToken, 
        changePassword, 
        getCurrentUser }  