import { Router } from "express";
import {publishVideo, deleteVideo} from "../controllers/video.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const route = Router()

route.use(verifyJWT)

route.route("/publish").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]), publishVideo )

    route.route("/delete-video/:videoId").delete(deleteVideo);
