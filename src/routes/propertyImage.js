"use strict"

const router = require("express").Router()

/* ----------------------------------- */
// routes/propertyImage
const propertyImage = require("../controllers/propertyImage")
const upload = require("../middlewares/upload")

router.route("/")
    .get(propertyImage.list)
    // upload.single('image') intercepts the binary network data before hitting controller, processes the file upload, and attaches the file information to req.file for use in the controller. This allows the controller to access the uploaded file's details and path without having to handle the raw file data directly.
    .post(upload.single("image"), propertyImage.create)

router.route("/:id/set-cover")
    .patch(propertyImage.changeCoverStatus)

router.route("/:id")
    .get(propertyImage.read)
    .put(propertyImage.update)
    .patch(propertyImage.update)
    .delete(propertyImage.delete)
/* ----------------------------------- */

module.exports = router
