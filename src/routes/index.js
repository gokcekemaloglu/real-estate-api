"use strict"

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */


const router = require("express").Router()

/* ----------------------------------- */
/* AUTH ROUTES */

// User routes:
router.use("/users", require("./user"))

// Token routes:
router.use("/tokens", require("./token"))

// Auth routes:
router.use("/auth", require("./auth"))

/* ----------------------------------- */
/* OTHER ROUTES */

// Property routes:
router.use("/properties", require("./property"))

// Documents:
router.use("/documents", require("./document"))



/* ----------------------------------- */
module.exports = router
