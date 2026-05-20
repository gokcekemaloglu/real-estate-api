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

//documents:
router.use("/documents", require("./document"))


/* ----------------------------------- */
module.exports = router
