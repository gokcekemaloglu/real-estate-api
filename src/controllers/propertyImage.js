"use strict";

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const PropertyImage = require("../models/propertyImage");
const { mongoose } = require("../configs/dbConnection");
const CustomError = require("../errors/customErrors");
const cloudinary = require("cloudinary").v2;

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

    // Validate if a physical file was uploaded by Multer
    if (!req.file) {
      throw new CustomError("Image file is required", 400);
    }

    const {propertyId} = req.body
    if(!propertyId || !req.file) {
      throw new CustomError("propertyId and image file are required", 400)
    }

    // 2. Swapped legacy static local folder path string definitions with 'req.file.path'. This safely stores the absolute Cloudinary secure CDN image URL link into MongoDB!
    const imageUrl = req.file.path;
    
    const data = await PropertyImage.create({ propertyId, imageUrl});
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
    const data = await PropertyImage.findOne({ _id: id }).populate("propertyId");
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
    if(!req.user || !req.user?.isAdmin) {
      throw new CustomError("Only admins can update property Images", 403)
    }

    const { propertyId } = req.body;
    if (!propertyId) {
      throw new CustomError("propertyId is required for update", 400);
    }
    
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      throw new CustomError("Invalid propertyId format", 400);
    }


    const data = await PropertyImage.findOneAndUpdate({ _id: id }, {propertyId}, {returnDocument: "after", runValidators: true});
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
    const currentImage = await PropertyImage.findOne({ _id: id });
    if (!currentImage) {
      throw new CustomError("Property Image not found", 404);
    }
    // Toggle the isCover status
    const targetPropertyId = currentImage.propertyId.toString();
    // If this image is going to be the cover, we must first reset ALL other images of the SAME property to isCover: false
    await PropertyImage.updateMany(
      { propertyId: targetPropertyId },
      { $set: {isCover: false} }
    );
    // Set the current selected image as the true cover
    const data = await PropertyImage.findOneAndUpdate(
      { _id: id },
      { isCover: true },
      { returnDocument: "after", runValidators: true },
    );
    if (!data) {
      throw new CustomError("Property Image not found", 404);
    }
    res.status(200).send({
      error: false,
      message: "This image is now set as the property cover image",
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
    // 1. Fetch record parameters from MongoDB to inspect URL segments before committing deletion queries
    const targetImage = await PropertyImage.findById(id);
    if (!targetImage) {
      throw new CustomError("Property Image not found", 404);
    }

    // 2. Safely extract Cloudinary public_id from database string link mappings.
    // Cloudinary folder schemas configuration matches 'gorkem-emlak-portfolio/' prefix exactly.
    try {
      const imageUrlStr = targetImage.imageUrl;
      const urlTokens = imageUrlStr.split("/");
      const lastTokenWithExt = urlTokens[urlTokens.length - 1]; // e.g., "img-123-456.webp"
      const publicIdKey = lastTokenWithExt.split(".")[0]; // e.g., "img-123-456"
      
      const fullCloudPublicId = `gorkem-emlak-portfolio/${publicIdKey}`;

      // Fires dynamic background network pipelines to erase asset from Cloudinary Media Library instantly!
      await cloudinary.uploader.destroy(fullCloudPublicId);
    } catch (cloudError) {
      // Gracefully prevent operational crashes if the file was manually deleted from Cloudinary dashboard metrics
      console.error("Cloudinary resource disposal error logs:", cloudError.message);
    }

    // 3. Finalize and purge metadata rows safely from your MongoDB database collection
    await PropertyImage.findByIdAndDelete(id);
    res.status(200).send({
      error: false,
      message: "Property Image record and cloud asset file deleted successfully",
    });
  }
};
