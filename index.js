"use strict"

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const express = require("express")
const app = express()

/* ----------------------------------- */
// Required Modules:

// envVariables to process.env:
require("dotenv").config()
const HOST = process.env?.HOST || '127.0.0.1'
const PORT = process.env?.PORT || 8000

/* ----------------------------------- */
// Configrations:

// DB Connection:
const {dbConnection} = require ("./src/configs/dbConnection")
dbConnection()

/* ------------------------------------------------------- */
// Middlewares:

// Accept JSON:
app.use(express.json())

// Instructs Express to use extended 'qs' parser to seamlessly unpack nested filter[key] objects!
app.set("query parser", "extended")

// Cors
const cors = require("cors")
// Strips accidental trailing slashes and whitespace/newline characters
// that commonly sneak in when pasting a URL into a hosting provider's
// environment variable dashboard (e.g. "https://site.vercel.app/" or
// "https://site.vercel.app\n"). Without this, an otherwise-correct
// CLIENT_URL value can silently fail to match the browser's Origin
// header, which is always sent WITHOUT a trailing slash.
const normalizeOrigin = (url) => (url ? url.trim().replace(/\/+$/, "") : url);

// Dynamic origin validation matrix accommodating both local development loopbacks and production environments URLs injected seamlessly via process.env tokens
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    normalizeOrigin(process.env.CLIENT_URL)
].filter(Boolean); // Cleans out any undefined or empty string cells from the layout arrays

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin specified, such as Postman, server-to-server or mobile apps
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(normalizeOrigin(origin)) !== -1) {
            callback(null, true);
        } else {
            // Logs the exact rejected origin alongside the current allow-list,
            // so any future mismatch (typo, new frontend domain, preview
            // deployment URL, etc.) is immediately diagnosable from the
            // Render logs instead of requiring another round of guesswork.
            console.warn(`CORS blocked request from origin: "${origin}" — allowed origins: ${JSON.stringify(allowedOrigins)}`);
            callback(new Error("CORS yasal erişim engeli: Bu kök adresten istek atılamaz."));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    exposedHeaders: ["Authorization", "set-cookie"]
}

// Open Gateway for Frontend URL safely
app.use(cors(corsOptions))

// This middleware allows Express to read data sent from HTML forms.
// It converts form data into a JavaScript object and makes it available in req.body.
app.use(express.urlencoded({ extended: true }))

// Check Authentication:
app.use(require("./src/middlewares/authentication"));

// res.getModelList middleware:
app.use(require("./src/middlewares/queryHandler"))

// StaticFiles:
// Express static middleware opens public folder to the world, allowing access to uploaded images via URL. For example, an image stored at public/uploads/image.jpg can be accessed at http://HOST:PORT/uploads/image.jpg. This is essential for serving uploaded files to clients.
app.use(express.static("public"));
/* ------------------------------------------------------- */

/* ----------------------------------- */
// Routes:

// HomePath:
app.all('/', (req, res) => {
    res.send({
          error: false,
          message: 'Welcome to Real Estate API',
          documents: {
                swagger: '/documents/swagger',
                redoc: '/documents/redoc',
                json: '/documents/json',
        },
        // user: req.user
    })
})

// Routes:
app.use(require('./src/routes'))

// Not Found — must sit AFTER all real routes and BEFORE errorHandler:
// if nothing above matched the incoming request, it falls through to
// here. Using a plain app.use (no path pattern) rather than app.use('*',
// ...) because Express 5's path-to-regexp version handles bare wildcards
// differently and can throw at startup — an argument-less app.use always
// means "run for any request that reached this point unhandled."
// Not Found
app.use((req, res) => {
    res.status(404).json({
        error: true,
        message: '404 Not Found'
    })
})

/* ----------------------------------- */

// errorHandler:
app.use(require("./src/middlewares/errorHandler"));

/* ------------------------------------------------------- */


// RUN SERVER:
app.listen(PORT, () => console.log(`Server running at http://${PORT}`))

/* ----------------------------------- */
