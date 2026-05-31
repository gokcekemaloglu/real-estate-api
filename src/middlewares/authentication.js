"use strict"
/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */
// app.use(authentication):

const jwt = require('jsonwebtoken')
const Token = require('../models/token')

module.exports = async (req, res, next) => {
    // Initialize req.user as null for every incoming request before authentication checks
    req.user = null;

    const auth = req.headers?.authorization || null // Token ...tokenKey... // Bearer ...accessToken...
    const tokenKey = auth ? auth.split(' ') : null // ['Token', '...tokenKey...'] // ['Bearer', '...accessToken...']

    if (tokenKey) {

        if (tokenKey[0] == 'Token') {

            // --- SIMPLE TOKEN AUTHENTICATION ---
            const tokenData = await Token.findOne({ token: tokenKey[1] }).populate('userId')
            // If simple token is valid and user is active, inject into request context
            if (tokenData && tokenData.userId && tokenData.userId.isActive) {
                req.user = tokenData.userId;
            }

        } else if (tokenKey[0] == 'Bearer') { 
            
            // --- JWT AUTHENTICATION ---
            // We use a custom promise control or handle inside a safe verification to allow guest access without throwing an error for expired or invalid tokens.
            try{
                // Verify the token. If it's invalid/expired, it throws an error. Express 5 will catch this error and handle it gracefully, allowing the request to continue without authentication instead of crashing the server.
                const decoded= jwt.verify(tokenKey[1], process.env.ACCESS_KEY)
                // If JWT is verified and user account is active, inject data into request context
                if (decoded && decoded.isActive) {
                    // You can choose to inject the entire decoded token or just specific fields like userId, depending on your application's needs.
                    req.user = decoded; 
                }
            } catch(err){
                // BEST PRACTICE FOR GUEST FRIENDLY SITES: 
                // If the token is expired or fake, we DON'T crash the app. 
                // We log the error in development and let the user continue as a "Guest User" (req.user remains null).
                console.error("JWT Verification failed, continuing as Guest:", err.message);
            }
        }
    }
    next()
}