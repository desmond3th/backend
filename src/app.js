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

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const app = express();

// Dynamic CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? 'https://your-production-domain.com' : 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

// Logging with Morgan
app.use(morgan('dev'));

// Security headers with Helmet
app.use(helmet());

// Body parsing
app.use(express.json({ limit: '13kb' }));
app.use(express.urlencoded({ extended: true, limit: '13kb' }));

// Static file serving
app.use(express.static('public'));

// Cookie parsing
app.use(cookieParser());

// Import route
import route from './routes/user.route.js';

// Route declaration
app.use('/api/v1/users', route);

// 404 Error handling
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Global error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


export { app }