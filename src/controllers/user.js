"use strict";

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const User = require("../models/user");

const { mongoose } = require("../configs/dbConnection");
const CustomError = require("../errors/customErrors");
/* ------------------------------------------------- *
User Model requirements
{
  "userName": "admin",
  "password": "aA?123456",
  "email": "admin@site.com",
  "firstName": "admin",
  "lastName": "admin",
  "isActive": true,
  "isAdmin": true
}
/* ------------------------------------------------- */

module.exports = {
  list: async (req, res) => {
    /* 
      #swagger.tags = ["Users"]
      #swagger.summary = "List Users"
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
    const data = await res.getModelList(User, customFilter);
    const details = await res.getModelListDetails(User, customFilter);
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
      #swagger.tags = ["Users"]
      #swagger.summary = "Create User"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          "userName": "test",
          "password": "aA!123456",
          "email": "test@site.com",
          "firstName": "test",
          "lastName": "test",
        }
      }
    */
    const data = await User.create({
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    });
    
    res.status(201).send({
      error: false,
      message: "User created successfully",
      data,
    });
  },
  read: async (req, res) => {
    /* 
      #swagger.tags = ["Users"]
      #swagger.summary = "Read User"
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }
    const data = await User.findOne({ _id: id });
    if (!data) {
      throw new CustomError("User not found", 404);
    }
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /* 
      #swagger.tags = ["Users"]
      #swagger.summary = "Update User"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          "userName": "test",
          "email": "test@site.com",
          "password": "aA!123456",
          "firstName": "test",
          "lastName": "test",
        }
      }
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }
    const {_id, password, ...updatedData} = req.body

    const data = await User.findOneAndUpdate({_id: id}, updatedData, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!data) {
      throw new CustomError("User not found", 404);
    }
    if (data.modifiedCount) {
      
      res.status(200).send({
        error: false,
        message: "User updated successfully",
        data,
        // new: await User.findOne({_id: req.params.id})
      });
    } else {
      res.status(200).send({
        error: false,
        message: "This user is not found or there is no change in the data",
        data,
      });
    }
  },
  delete: async (req, res) => {
    /* 
      #swagger.tags = ["Users"]
      #swagger.summary = "Delete User"
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }
    const data = await User.deleteOne({ _id: id });
    res.status(data.deletedCount ? 200 : 404).send({
      error: !data.deletedCount,
      message: data.deletedCount
        ? "User deleted successfully"
        : "User not found",
      data,
    });
  },
  changeUserStatus: async (req, res) => {
    /* 
      #swagger.tags = ["Users"]
      #swagger.summary = "Toggle User Status (Active/Inactive)"
      #swagger.description = "Toggles user's isActive status. If active becomes inactive, if inactive becomes active."
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }
    
    // Find the user by ID
    const user = await User.findOne({_id: id})

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    // Toggle the isActive status
    const newStatus = !(user.isActive);
    const data = await User.findOneAndUpdate(
      { _id: id },
      { isActive: newStatus },
      { returnDocument: "after", runValidators: true }
    );
    res.status(200).send({
      error: false,
      message: `User status changed successfully. User is now ${data.isActive ? "active" : "inactive"}.`,
      data,
    });
  },
  changeMyPassword: async (req, res) => {
    /* 
      #swagger.tags = ["Users"]
      #swagger.summary = "Update User"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          "currentPassword": "***",
          "newPassword": "***",
          "retypePassword": "***",
        }
      }
    */

    const { currentPassword, newPassword, retypePassword } = req.body;

    if (!currentPassword || !newPassword || !retypePassword) {
      throw new CustomError("Password Fields Required");
    }

    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      throw new CustomError("User not found");
    }

    const isPasswordCorrect = await user.correctPassword(currentPassword, user?.password);

    if (!isPasswordCorrect) {
      throw new CustomError("Current password is incorrect", 401);
    }

    if (newPassword !== retypePassword) {
      throw new CustomError("New passwords do not match", 401);
    }

    user.password = newPassword;

    await user.save();

    res.status(201).send({
      error: false,
      message: "Password changed successfully",
      data: user,
    });
  },
};
