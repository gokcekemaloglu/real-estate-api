"use strict";

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const Favorite = require("../models/favorite");
const User = require("../models/user");
const Property = require("../models/property");

const { mongoose } = require("../configs/dbConnection");
const CustomError = require("../errors/customErrors");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Favorites"]
      #swagger.summary = "List Favorites"
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
      if (!req.user?.id) {
        throw new CustomError("Authentication required to view favorites", 401);
      }
      customFilter = { userId: req.user.id };
    }
    const data = await res.getModelList(Favorite, customFilter, ["userId", "propertyId"]);
    const details = await res.getModelListDetails(Favorite, customFilter);
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
      #swagger.tags = ["Favorites"]
      #swagger.summary = "Create Favorite"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          $ref: "#/definitions/Favorite"
        }
      }
    */

    const id = req.user?.id;
    
    if (!id) {
      throw new CustomError("User ID is required", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid User ID format", 400);
    }

    const bodyUserId = req.body.userId;
    
    if (bodyUserId && bodyUserId !== id) {
      throw new CustomError("You can only create favorites for yourself", 403);
    }
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    req.body.userId = id; // Ensure the favorite is always created for the authenticated user

    propertyId = req.body.propertyId;
    if (!propertyId) {
      throw new CustomError("Property ID is required", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      throw new CustomError("Invalid Property ID format", 400);
    }

    const propertyExists = await Property.findById(propertyId);
    if (!propertyExists) {
      throw new CustomError("Property not found", 404);
    }

    const data = await Favorite.create(req.body);
    res.status(201).send({
      error: false,
      message: "Favorite created successfully",
      data,
    });
  },
  read: async (req, res) => {
    /*
      #swagger.tags = ["Favorites"]
      #swagger.summary = "Get Single Favorite"
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }
    const data = await Favorite.findOne({ _id: id })
      .populate("userId")
      .populate("propertyId");
    if (!data) {
      throw new CustomError("Favorite not found", 404);
    }
    if (!req.user?.isAdmin && data.userId._id.toString() !== req.user?.id) {
      throw new CustomError("You do not have permission to view this favorite", 403);
    }
    res.status(200).send({
      error: false,
      data,
    });
  },
  delete: async (req, res) => {
    /*
      #swagger.tags = ["Favorites"]
      #swagger.summary = "Hard Delete Favorite"
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }
    const favoriteRecord = await Favorite.findById(id);
    if (!favoriteRecord) {
      throw new CustomError("Favorite not found", 404);
    }
    if (!req.user?.isAdmin && favoriteRecord.userId.toString() !== req.user?.id) {
      throw new CustomError("You do not have permission to delete this favorite", 403);
    }
    const data = await Favorite.findOneAndDelete({ _id: id });
    if (!data) {
      throw new CustomError("Favorite not found", 404);
    }
    res.status(200).send({
      error: false,
      message: "Favorite deleted successfully",
      data,
    });
  },
};
