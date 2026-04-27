"use strict"

const router = require("express").Router()

/* ----------------------------------- */
// routes

// Property routes:
router.use("/properties", require("./property"))


/* ----------------------------------- */
module.exports = router