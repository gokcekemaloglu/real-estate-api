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
const comparePassword = (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword)
}

module.exports = {
    comparePassword
}