"use strict"

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */


const router = require("express").Router()

/* ----------------------------------- */
// routes

// Property routes:
router.use("/properties", require("./property"))
// User routes:
router.use("/users", require("./user"))


/* ----------------------------------- */
module.exports = router
