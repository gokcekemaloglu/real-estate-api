"use strict"

// MongoDB Connection

const mongoose = require("mongoose")

const dbConnection = function () {
    // Enforces schema-based query filtering.
    // If a query contains fields not defined in the schema, Mongoose will ignore them. This improves query safety and prevents unexpected filtering behavior.
    mongoose.set("strictQuery", true)
    // Connect to MongoDB Atlas:
    mongoose.connect(process.env.MONGODB, 
        // { useNewUrlParser: true, useUnifiedTopology: true }
    )
        .then(() => console.log('* DB Connected * '))
        .catch((err) => console.log('* DB Not Connected * ', err))
}

/* ------------------------------------------------------- */

module.exports = {
    mongoose,
    dbConnection
}