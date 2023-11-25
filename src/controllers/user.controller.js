import { asyncHandler } from "../utils/asyncHandler.js"; 

// Defining a route handler for registering a user wrapped with error handling
const regUser = asyncHandler( async (req, res) => {
    res.status(200).json({
        message: "ok"
    })
})