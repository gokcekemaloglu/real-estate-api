"use strict";

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const PropertyImage = require("../models/propertyImage");

const { mongoose } = require("../configs/dbConnection");
const CustomError = require("../errors/customErrors");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Property Images"]
      #swagger.summary = "List Property Images"
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

    const data = await res.getModelList(PropertyImage, customFilter);
    const details = await res.getModelListDetails(PropertyImage);
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
      #swagger.tags = ["Property Images"]
      #swagger.summary = "Create Property Image"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          $ref: "#/definitions/PropertyImage"
        }
      }
    */
    if (!req.user || !req.user?.isAdmin) {
      throw new CustomError("Only admins can create property Images", 403)
    }
    const data = await PropertyImage.create(req.body);
    res.status(201).send({
      error: false,
      message: "Property Image created successfully",
      data,
    });
  },
  read: async (req, res) => {
    /*
      #swagger.tags = ["Property Images"]
      #swagger.summary = "Get Single PropertyImage"
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }
    const data = await PropertyImage.findOne({ _id: id });
    if (!data) {
      throw new CustomError("Property Image not found", 404);
    }
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /*
      #swagger.tags = ["Property Images"]
      #swagger.summary = "Update Property Image"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          $ref: "#/definitions/PropertyImage"
        }
      }
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }
    const allowedFields = ["propertyId", "imageUrl"];
    if(!req.user || !req.user?.isAdmin) {
      throw new CustomError("Only admins can update property Images", 403)
    }
    const filteredBody = {};
    for (let key in req.body) {
      if (allowedFields.includes(key)) {
        filteredBody[key] = req.body[key]
      }
    }
    const data = await PropertyImage.findOneAndUpdate({ _id: id }, filteredBody, {returnDocument: "after", runValidators: true});
    if (!data) {
      throw new CustomError("Property Image not found", 404);
    }
    res.status(200).send({
      error: false,
      message: "Property Image updated successfully",
      data,
    });
  },
  changeCoverStatus: async (req, res) => {
    /*
      #swagger.tags = ["Property Images"]
      #swagger.summary = "Change Property Image Cover Status"
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }
    if(!req.user || !req.user?.isAdmin) {
      throw new CustomError("Only admins can change property Image cover status", 403)
    }
    const propertyImage = await PropertyImage.findOne({ _id: id });
    if (!propertyImage) {
      throw new CustomError("Property Image not found", 404);
    }
    // Toggle the isCover status
    const newStatus = !(propertyImage.isCover);
    const data = await PropertyImage.findOneAndUpdate(
      { _id: id },
      { isCover: newStatus },
      { returnDocument: "after", runValidators: true },
    );
    if (!data) {
      throw new CustomError("Property Image not found", 404);
    }
    res.status(200).send({
      error: false,
      message: `Property Image status changed successfully. Now the image is ${data.isCover ? "set as cover" : "not set as cover"}`,
      data,
    });
  },
  delete: async (req, res) => {
    /*
      #swagger.tags = ["Property Images"]
      #swagger.summary = "Hard Delete Property Image"
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }
    if(!req.user || !req.user?.isAdmin) {
      throw new CustomError("Only admins can delete property Images", 403)
    }
    const data = await PropertyImage.findOneAndDelete({ _id: id });
    if (!data) {
      throw new CustomError("Property Image not found", 404);
    }
    res.status(200).send({
      error: false,
      message: "Property Image hard deleted successfully",
      data,
    });
  }
};
