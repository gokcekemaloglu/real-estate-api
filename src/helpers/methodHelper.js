"use strict"

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const crypto = require("crypto")
const bcrypt = require("bcrypt")

/**
 * Compares a candidate password with the user's hashed password.
 * @param {string} candidatePassword - The password entered by the user.
 * @param {string} userPassword - The hashed password stored in the database.
 * @returns {Promise<boolean>} - Returns true if passwords match, false otherwise.
*/
const comparePassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword)
}

/* Generates a high-entropy, random token string using crypto module. */
const generateSimpleTokenKey = (userId) => {
    const randomBytes = crypto.randomBytes(16).toString("hex") // 32 characters
    const timestamp = Date.now().toString(16) // 8 characters
    const rawTokenString = `${userId}-${timestamp}-${randomBytes}` // Total length: 32 + 8 + userId length + 2 (for dashes) = 42 + userId length
    return crypto.createHash("sha256").update(rawTokenString).digest("hex") // Final token: 64 characters
}

module.exports = {comparePassword, generateSimpleTokenKey}