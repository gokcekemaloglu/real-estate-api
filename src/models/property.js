"use strict"

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const {mongoose} = require("../configs/dbConnection")

const PropertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        index: true
    },
    listingType: {
        type: String,
        enum: ["sale", "rent"],
        required: true,
        index: true
    },
    propertyType: {
        type: String,
        enum: ["apartment", "house", "villa", "land", "commercial"],
        required: true,
        index: true
    },
    city: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    district: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    neighbourhood: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    fullAddress: {
        type: String,
        required: true,
        trim: true
    },
    grossArea:{
        type: Number,
        min: 0
    },
    netArea: {
        type: Number,
        min: 0
    },
    floor: {
        type: Number,
        min: 0
    },
    totalFloors: {
        type: Number,
        min: 0
    },
    roomCount: {
        type: String,
        trim: true
    },
    buildingAge: {
        type: Number,
        min: 0
    },
    heatingType: {
        type: String,
        enum: ["central", "combi", "electric", "stove", "none"]
    },
    /*hasBalcony: {
        type: Boolean,
        default: false
    },*/
    hasElevator: {
        type: Boolean,
        default: false
    },
    hasParking: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    viewCount: {
        type: Number,
        default: 0
    },
    favouritesCount: {
        type: Number,
        default: 0
    },
    isLoanEligible: {
        type: Boolean,
        default: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
        index: true
    }
}, {
    collection: "properties",
    timestamps: true
})

module.exports = mongoose.model("Property", PropertySchema)
