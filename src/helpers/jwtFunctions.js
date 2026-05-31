"use strict"

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const jwt = require("jsonwebtoken")
/* Signs a short-lived Access Token */
const signAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            userName: user.userName,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
        },
        process.env.ACCESS_KEY,
        { expiresIn: "15m" }
    );
}
/* Signs a long-lived Refresh Token */
const signRefreshToken = (user) => {
    return jwt.sign(
        {_id: user._id},
        process.env.REFRESH_KEY,
        { expiresIn: "7d" }
    )
}

module.exports = {signAccessToken, signRefreshToken}
