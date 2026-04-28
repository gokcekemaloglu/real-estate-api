"use strict"

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const User = require("../models/user")

const { mongoose } = require("../configs/dbConnection");
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
        const data = await User.create(req.body);
        res.status(201).send({
          error: false,
          message: "User created successfully",
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
        const data = await User.findOne({ _id: id })
        if (!data) {
          return res.status(404).send({
            error: true,
            message: "User not found",
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
          "userName", "password", "email", "firstName", "lastName", "isAdmin"
        ];
        const filteredBody = {};
        for (let key in req.body) {
            if (allowedFields.includes(key)) {
                filteredBody[key] = req.body[key]
            }
        }
        const data = await User.findOneAndUpdate({ _id: id }, filteredBody, {returnDocument: "after", runValidators: true});
        if (!data) {
          return res.status(404).send({
            error: true,
            message: "User not found",
          });
        }
        res.status(200).send({
          error: false,
          message: "User updated successfully",
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
        const data = await User.findOneAndUpdate({ _id: id }, { isActive: false, isAdmin: false }, { returnDocument: "after", runValidators: true });
        if (!data) {
          return res.status(404).send({
            error: true,
            message: "User not found",
          });
        }
        res.status(200).send({
          error: false,
          message: "User is inactive now",
          data,
        });
      },
}