"use strict"

const router = require("express").Router()

/* ----------------------------------- */
// routes/user
const user = require("../controllers/user")

router.route("/")
    .get(user.list)
    .post(user.create)

router.route("/:id/status")
    .patch(user.changeUserStatus)
router.route("/:id/updateMe")
    .patch(user.updateMe)
router.route("/:id/changeMyPassword")
    .patch(user.changeMyPassword);

router.route("/:id")
    .get(user.read)
    .put(user.update)
    .patch(user.update)
    .delete(user.delete)
/* ----------------------------------- */

module.exports = router
