"use strict";

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const Property = require("../models/property");

const { mongoose } = require("../configs/dbConnection");
const CustomError = require("../errors/customErrors");
const Customer = require("../models/customer");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Properties"]
      #swagger.summary = "List Properties"
      #swagger.description = `
        You can use <u>filter[] & search[] & sort[] & page & limit</u> queries with endpoint.
        <ul> Examples:
          <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
          <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
          <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
          <li>URL/?<b>limit=10&page=1</b></li>
        </ul>
      `
    */
    let customFilter = {};
    if (!req.user?.isAdmin) {
      customFilter = {isActive: true}
    }
    const data = await res.getModelList(Property, customFilter, "ownerId");
    const details = await res.getModelListDetails(Property, customFilter);
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
    /*
      #swagger.tags = ["Properties"]
      #swagger.summary = "Create Property"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          $ref: "#/definitions/Property"
        }
      }
    */
    if(!req.user || !req.user.isAdmin) {
      throw new CustomError("Only admins can create properties", 403)
    }

    // Validate if the owner actually exists
    if(req.body.ownerId) {
      // const { default: customerCheck } = require("../models/customer"); // Dynamically import to prevent circular dependency
      const owner = await Customer.findById(req.body.ownerId);
      if(!owner) {
        throw new CustomError("Owner not found", 404);
      }
    }

    if(req.user?.id) {
      req.body.createdBy = req.user.id
    }
    const data = await Property.create(req.body);
    res.status(201).send({
      error: false,
      message: "Property created successfully",
      data,
    });
  },
  read: async (req, res) => {
    /*
      #swagger.tags = ["Properties"]
      #swagger.summary = "Get Single Property"
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }
    const data = await Property.findOne({ _id: id }).populate("ownerId");
    if (!data) {
      throw new CustomError("Property not found", 404);
    }
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /*
      #swagger.tags = ["Properties"]
      #swagger.summary = "Update Property"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          $ref: "#/definitions/Property"
        }
      }
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }
    if(!req.user || !req.user.isAdmin) {
      throw new CustomError("Only admins can update properties", 403)
    }

    // Validate if the owner actually exists
    if(req.body.ownerId) {
      const owner = await Customer.findById(req.body.ownerId);
      if(!owner) {
        throw new CustomError("Owner not found", 404);
      }
    }
    
    const allowedFields = ["title", "description", "price", "listingType", "propertyCategory", "city", "district", "neighbourhood", "fullAddress", "grossArea", "netArea", "floor", "totalFloors", "roomCount", "buildingAge", "heatingType", "hasElevator", "hasParking", "isLoanEligible", "isFeatured", "ownerId", "bathroomCount", "maintenanceFee", "isFurnished", "occupancyStatus"];
    const filteredBody = {};
    for (let key in req.body) {
      if (allowedFields.includes(key)) {
        filteredBody[key] = req.body[key]
      }
    }
    const data = await Property.findOneAndUpdate({ _id: id }, filteredBody, {returnDocument: "after", runValidators: true});
    if (!data) {
      throw new CustomError("Property not found", 404);
    }
    res.status(200).send({
      error: false,
      message: "Property updated successfully",
      data,
    });
  },
  changePropertyStatus: async (req, res) => {
    /*
      #swagger.tags = ["Properties"]
      #swagger.summary = "Change Property Status"
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }

    if(!req.user || !req.user.isAdmin) {
      throw new CustomError("Only admins can change property status", 403)
    }

    const property = await Property.findOne({ _id: id });
    if (!property) {
      throw new CustomError("Property not found", 404);
    }
    // Toggle the isActive status
    const newStatus = !(property.isActive);
    const data = await Property.findOneAndUpdate(
      { _id: id },
      { isActive: newStatus },
      { returnDocument: "after", runValidators: true },
    );
    if (!data) {
      throw new CustomError("Property not found", 404);
    }
    res.status(200).send({
      error: false,
      message: `Property status changed successfully. Now ${data.isActive ? "Active" : "Inactive"}`,
      data,
    });
  },
  changeFeaturedStatus: async (req, res) => {
    /*
      #swagger.tags = ["Properties"]
      #swagger.summary = "Change Property's Featured Status"
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }

    if(!req.user || !req.user.isAdmin) {
      throw new CustomError("Only admins can change property featured status", 403)
    }

    const property = await Property.findOne({ _id: id });
    if (!property) {
      throw new CustomError("Property not found", 404);
    }
    // Toggle the isFeatured status
    const newStatus = !(property.isFeatured);
    const data = await Property.findOneAndUpdate(
      { _id: id },
      { isFeatured: newStatus },
      { returnDocument: "after", runValidators: true },
    );
    if (!data) {
      throw new CustomError("Property not found", 404);
    }
    res.status(200).send({
      error: false,
      message: `Featured status changed successfully. Now ${data.isFeatured ? "Featured" : "Standard"}`,
      data,
    });
  },
  delete: async (req, res) => {
    /*
      #swagger.tags = ["Properties"]
      #swagger.summary = "Hard Delete Property"
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }
    if(!req.user || !req.user.isAdmin) {
      throw new CustomError("Only admins can delete properties", 403)
    }
    const data = await Property.findOneAndDelete({ _id: id });
    if (!data) {
      throw new CustomError("Property not found", 404);
    }
    res.status(200).send({
      error: false,
      message: "Property hard deleted successfully",
      data,
    });
  }
};
