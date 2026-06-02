"use strict"

const router = require("express").Router()

/* ----------------------------------- */
// routes/property
const property = require("../controllers/property")

router.route("/")
    .get(property.list)
    .post(property.create)

router.route("/:id/status")
    .patch(property.changePropertyStatus)
router.route("/:id/featured")
    .patch(property.changeFeaturedStatus)

router.route("/:id")
    .get(property.read)
    .put(property.update)
    .patch(property.update)
    .delete(property.delete)
/* ----------------------------------- */


module.exports = router
