"use strict"

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const {mongoose} = require("../configs/dbConnection")

const PropertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Ad title / Listing title is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: 0,
        index: true
    },
    listingType: {
        type: String,
        enum: ["sale", "rent", "transfer_sale", "transfer_rent"],
        required: [true, "Listing type is required"],
        index: true
    },
    propertyCategory: {
        type: String,
        enum: ["apartment", "house", "villa", "land", "commercial"],
        required: [true, "Property Category is required"],
        index: true
    },
    city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
        index: true
    },
    district: {
        type: String,
        required: [true, "District is required"],
        trim: true,
        index: true
    },
    neighbourhood: {
        type: String,
        required: [true, "Neighbourhood is required"],
        trim: true,
        index: true
    },
    fullAddress: {
        type: String,
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
    bathroomCount: {
        type: Number,
        min: 0,
        default: 0
    },
    buildingAge: {
        type: Number,
        min: 0
    },
    heatingType: {
        type: String,
        enum: ["combi", "air_conditioner", "electric", "central_share_meter", "central", "none"],
        default: "none"
    },
    maintenanceFee: {
        type: Number,
        min: 0,
        default: 0
    },
    isFurnished: {
        type: Boolean,
        default: false
    },
    occupancyStatus: {
        type: String,
        enum: ["vacant", "tenant", "owner"], 
        index: true
    },
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
        // required: true
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
        // required: true,
        index: true
    }
}, {
    collection: "properties",
    timestamps: true
})

PropertySchema.index({createdAt: -1})

module.exports = mongoose.model("Property", PropertySchema)
