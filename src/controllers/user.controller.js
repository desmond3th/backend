import { asyncHandler } from "../utils/asyncHandler.js"; 

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
    
})

export { regUser }  