"use strict"

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const {mongoose} = require("../configs/dbConnection")

const UserSchema = new mongoose.Schema({
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
        index: true,
        sparse: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        select: false
    },
    // role: {
    //     type: String,
    //     enum: ["admin", "agent", "customer"],
    //     default: "customer"
    // },
    phone: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
}, {
    collection: "users",
    timestamps: true
})

module.exports = mongoose.model("User", UserSchema)
