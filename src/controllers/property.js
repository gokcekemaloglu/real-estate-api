"use strict"

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const Property = require("../models/property")

const {mongoose} = require("../configs/dbConnection")

module.exports = {
    list: async (req, res) => {
        const data = await res.getModelList(Property, {}, "ownerId")
        const details= await res.getModelListDetails(Property)
        // console.log(req);
        // console.log(res);
        
        res.status(200).send({
            error: false,
            // message: req.,
            details,
            data
        })
    },
    create: async (req, res) => {
        const data = await Property.create(req.body)
        res.status(201).send({
            error: false,
            message: "Property created successfully",
            data
        })
    },
    read: async (req, res) => {},
    update: async (req, res) => {},
    delete: async (req, res) => {},
}