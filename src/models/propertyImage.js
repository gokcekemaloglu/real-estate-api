"use strict"

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const {mongoose} = require("../configs/dbConnection")

const PropertyImageSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
        index: true
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true
    },
    isCover: {
        type: Boolean,
        default: false,
        index: true
    }
}, {
    collection: "propertyImages",
    timestamps: true
})

module.exports = mongoose.model("PropertyImage", PropertyImageSchema)