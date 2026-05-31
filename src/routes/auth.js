"use strict"

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const router = require("express").Router()

/* ----------------------------------- */
// controllers:
const auth = require("../controllers/auth")

/* ----------------------------------- */
// URL: /auth
router.post("/signup", auth.signup);
router.post('/login', auth.login);
router.post('/refresh', auth.refresh);
router.get('/logout', auth.logout);

/* ----------------------------------- */
module.exports = router