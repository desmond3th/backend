import { Router } from "express";
import { regUser } from "../controllers/user.controller.js";


const route = Router()

// it will take to the register controller
route.route("/register").post(regUser) // make sure to send the POST status.

export default route