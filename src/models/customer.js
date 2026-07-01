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
    phone: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
        sparse: true,
        set: (value) => (value === "" || value === null || value === undefined ? undefined : value)
    },
    address: {
        type: String,
        trim: true
    },
    citizenshipId: {
        type: String,
        trim: true,
        index: true
    },
    note: [{
        content: String,
        createdAt: { type: Date, default: Date.now },
        // trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    collection: "customers",
    timestamps: true
})
module.exports = mongoose.model("Customer", CustomerSchema)