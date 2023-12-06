import { asyncHandler } from "../utils/asyncHandler.js"; 
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"


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


    const {fullname, email, username, password} = req.body

    const fields = [fullname, email, username, password];

    for (const field of fields) {
        if (!field || !field.trim()) {
            throw new ApiError(400, "Empty fields are not acceptable");
        }
    }

    const userExists = User.findOne(
        { $or : [{ username }, { email }]
    })

    if (userExists) {
        throw new ApiError(409, "User already exist")
    }
    
})

export { regUser }  