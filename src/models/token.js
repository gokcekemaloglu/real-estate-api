"use strict"

const { mongoose } = require("../configs/dbConnection");

/* ------------------------------------------------------- *
{
    "userId": "65343222b67e9681f937f001",
    "token": "...tokenKey..."
}
/* ------------------------------------------------------- */
// Token Model:

const TokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
        trim: true,
        index: true
    },
    token: {
        type: String,
        required: [true, "Token is required"],
        unique: true,
        trim: true,
        index: true
    }
}, {
    collection: "tokens",
    timestamps: true
})

/* ------------------------------------------------------- */

module.exports = mongoose.model("Token", TokenSchema)