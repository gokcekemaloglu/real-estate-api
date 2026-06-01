"use strict"

const router = require("express").Router()

/* ----------------------------------- */
// routes/customer
const customer = require("../controllers/customer")

router.route("/")
    .get(customer.list)
    .post(customer.create)

router.route("/:id")
    .get(customer.read)
    .put(customer.update)
    .patch(customer.update)
    .delete(customer.delete)
/* ----------------------------------- */

router.route("/:id/status")
    .patch(customer.changeCustomerStatus)

module.exports = router
