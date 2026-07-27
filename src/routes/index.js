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

// Property Image routes:
router.use("/property-images", require("./propertyImage"))

// Favorite routes:
router.use("/favorites", require("./favorite"))

// Customer routes:
router.use("/customers", require("./customer"))

// Documents:
router.use("/documents", require("./document"))

/* ----------------------------------- */
module.exports = router
