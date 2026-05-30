"use strict"

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */


const router = require("express").Router()

/* ----------------------------------- */
// routes
// User routes:
router.use("/users", require("./user"))

// Token routes:
router.use("/tokens", require("./token"))

// Property routes:
router.use("/properties", require("./property"))

//documents:
router.use("/documents", require("./document"))



/* ----------------------------------- */
module.exports = router
