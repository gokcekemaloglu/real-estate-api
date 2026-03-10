"use strict"

const express = require("express")
const app = express()

/* ----------------------------------- */
// Required Modules:

// envVariables to process.env:
require("dotenv").config()
const HOST = process.env?.HOST || '127.0.0.1'
const PORT = process.env?.PORT || 8000

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Real Estate API running")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})