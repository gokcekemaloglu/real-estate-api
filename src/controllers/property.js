"use strict";

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const Property = require("../models/property");

const { mongoose } = require("../configs/dbConnection");

module.exports = {
  list: async (req, res) => {
    let customFilter = {};
    const data = await res.getModelList(Property, customFilter, "ownerId");
    const details = await res.getModelListDetails(Property);
    // console.log(req);
    // console.log(res);

    res.status(200).send({
      error: false,
      // message: req.,
      details,
      data,
    });
  },
  create: async (req, res) => {
    const data = await Property.create(req.body);
    res.status(201).send({
      error: false,
      message: "Property created successfully",
      data,
    });
  },
  read: async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: true,
        message: "Invalid ID format",
      });
    }
    const data = await Property.findOne({ _id: id }).populate("ownerId");
    if (!data) {
      return res.status(404).send({
        error: true,
        message: "Property not found",
      });
    }
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: true,
        message: "Invalid ID format",
      });
    }
    const allowedFields = [
      "title",
      "description",
      "price",
      "listingType",
      "propertyType",
      "city",
      "district",
      "neighbourhood",
      "fullAddress",
      "grossArea",
      "netArea",
      "floor",
      "totalFloors",
      "roomCount",
      "buildingAge",
      "heatingType",
      "hasElevator",
      "hasParking",
      "isLoanEligible",
    ];
    const filteredBody = {};
    for (let key in req.body) {
        if (allowedFields.includes(key)) {
            filteredBody[key] = req.body[key]
        }
    }
    const data = await Property.findOneAndUpdate({ _id: id }, filteredBody, {returnDocument: "after", runValidators: true});
    if (!data) {
      return res.status(404).send({
        error: true,
        message: "Property not found",
      });
    }
    res.status(200).send({
      error: false,
      message: "Property updated successfully",
      data,
    });
  },
  delete: async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: true,
        message: "Invalid ID format",
      });
    }
    const data = await Property.findOneAndUpdate(
      { _id: id },
      { isActive: false, isFeatured: false },
      { returnDocument: "after", runValidators: true },
    );
    if (!data) {
      return res.status(404).send({
        error: true,
        message: "Property not found",
      });
    }
    res.status(200).send({
      error: false,
      message: "Property deleted successfully",
      data,
    });
  },
};
