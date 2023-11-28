import express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "13kb"}))
app.use(express.urlencoded({extended: true, limit: "13kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// import route
import route from "./routes/user.route.js";

// declaration
app.use("/api/v1/users", route)



// use API testing tool like POSTMAN to verify if API is working.


export { app }