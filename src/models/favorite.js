"use strict"

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const {mongoose} = require("../configs/dbConnection")

const FavoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
        index: true
    }
}, {
    collection: "favorites",
    timestamps: true
})

/*
 Prevent duplicate favorites
 Same user cannot favorite the same property twice
*/
FavoriteSchema.index({userId: 1, propertyId: 1}, {unique: true})

module.exports = mongoose.model("Favorite", FavoriteSchema)