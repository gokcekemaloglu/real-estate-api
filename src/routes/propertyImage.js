"use strict"

const router = require("express").Router()

/* ----------------------------------- */
// routes/propertyImage
const propertyImage = require("../controllers/propertyImage")

router.route("/")
    .get(propertyImage.list)
    .post(propertyImage.create)

router.route("/:id")
    .get(propertyImage.read)
    .put(propertyImage.update)
    .patch(propertyImage.update)
    .delete(propertyImage.delete)
/* ----------------------------------- */

router.route("/:id/status")
    .patch(propertyImage.changeCoverStatus)

module.exports = router
