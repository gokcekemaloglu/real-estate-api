"use strict"

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const {mongoose} = require("../configs/dbConnection")

const CustomerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    phone: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        index: true
    },
    address: {
        type: String,
        trim: true
    },
    citizenshipID: {
        type: String,
        trim: true
    },
    note: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    collection: "customers",
    timestamps: true
})
module.exports = mongoose.model("Customer", CustomerSchema)