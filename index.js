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

// Cors
const cors = require("cors")

// Open Gateway for Frontend URL safely
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}))

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

// Not Found
// app.use('*', (req, res) => {
//       res.status(404).json({
//         error: true,
//         message: '404 Not Found'
//     })
// })
/*
app.get("/", (req, res) => {
  res.send("Real Estate API running")
  })
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    })
    */


/* ----------------------------------- */

// errorHandler:
app.use(require("./src/middlewares/errorHandler"));

/* ------------------------------------------------------- */


// RUN SERVER:
app.listen(PORT, HOST, () => console.log(`Server running at http://${HOST}:${PORT}`))

/* ----------------------------------- */