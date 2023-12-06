import { Router } from "express";
import { regUser } from "../controllers/user.controller.js";

import {upload} from "../middlewares/multer.middleware.js"

const route = Router()

// it will take to the register controller
route.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    regUser) // make sure to send the POST status.

export default route