import { Router } from 'express';
import { toggleSubscription, getUserChannelSubscribers } from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const route = Router();

route.use(verifyJWT); 


route.route("/c/:channelId").get(getUserChannelSubscribers) 
route.route("/c/:channelId").post(toggleSubscription)

export default route