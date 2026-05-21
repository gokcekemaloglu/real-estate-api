"use strict"

const router = require("express").Router()

/* ----------------------------------- */
// routes/user
const user = require("../controllers/user")

router.route("/")
    .get(user.list)
    .post(user.create)

router.route("/:id")
    .get(user.read)
    .put(user.update)
    .patch(user.update)
    .delete(user.delete)

router.route("/:id/status")
    .patch(user.changeUserStatus)

router.route("/:id/changeMyPassword")
    .patch(user.changeMyPassword);

module.exports = router