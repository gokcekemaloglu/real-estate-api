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
    rentPeriod: {
        type: String,
        enum: ["monthly", "yearly", null],
        default: null
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
        trim: true,
        required: [true, "Room count is required"],
    },
    bathroomCount: {
        type: Number,
        min: 0
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
        min: 0
    },
    isFurnished: {
        type: Boolean,
        default: false
    },
    occupancyStatus: {
        type: String,
        enum: ["vacant", "tenant", "owner", null], 
        default: null,
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
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    viewsCount: {
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
    },
}, {
    collection: "properties",
    timestamps: true,
    // Converts virtual aggregate fields safely during JSON transits to frontend cards
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

PropertySchema.index({createdAt: -1})

// Maps a direct relational reference to compile favorites pop counts dynamically from the Favorite collection without storing redundant heavy data keys inside properties documents!
PropertySchema.virtual("favoriteCount", {
  ref: "Favorite",
  localField: "_id", // Local primary object identifier key
  foreignField: "propertyId", // Matched constraint identifier inside Favorite model schema
  count: true, // Tells MongoDB to return a direct absolute count integer instead of a nested document list array
});

module.exports = mongoose.model("Property", PropertySchema)
