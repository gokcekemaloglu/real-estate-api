"use strict"

const router = require("express").Router()

/* ----------------------------------- */
// routes/propertyImage
const propertyImage = require("../controllers/propertyImage")

router.route("/")
    .get(propertyImage.list)
    .post(propertyImage.create)

router.route("/:id/set-cover")
    .patch(propertyImage.changeCoverStatus)

router.route("/:id")
    .get(propertyImage.read)
    .put(propertyImage.update)
    .patch(propertyImage.update)
    .delete(propertyImage.delete)
/* ----------------------------------- */


module.exports = router
