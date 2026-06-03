"use strict"

const router = require("express").Router()

/* ----------------------------------- */
// routes/favorite
const favorite = require("../controllers/favorite")

router.route("/")
    .get(favorite.list)
    .post(favorite.create)

router.route("/toggle")
    .post(favorite.toggle)

router.route("/:id")
    .get(favorite.read)
    .delete(favorite.delete)
/* ----------------------------------- */


module.exports = router
