"use strict"

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

// This middleware allows Express to read data sent from HTML forms.
// It converts form data into a JavaScript object and makes it available in req.body.
app.use(express.urlencoded({ extended: true }))

// RUN SERVER:
app.listen(PORT, HOST, () => console.log(`Server running at http://${HOST}:${PORT}`))

/* ------------------------------------------------------- */

/*
app.get("/", (req, res) => {
  res.send("Real Estate API running")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
  */