"use strict";

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const Customer = require("../models/customer");

const { mongoose } = require("../configs/dbConnection");
const CustomError = require("../errors/customErrors");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Customers"]
      #swagger.summary = "List Customers"
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
    if (!req.user || !req.user?.isAdmin) {
      throw new CustomError("Only admins can view customers", 403)
    }
    let customFilter = {};
    if (req.query?.search?.q) {
      const keyword = req.query.search.q;
        
      customFilter.$or = [
        { firstName: { $regex: keyword, $options: 'i' } },
        { lastName: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } }
      ];
        
      delete req.query.search.q;
    }

    const data = await res.getModelList(Customer, customFilter);
    const details = await res.getModelListDetails(Customer, customFilter);
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
      #swagger.tags = ["Customers"]
      #swagger.summary = "Create Customer"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          $ref: "#/definitions/Customer"
        }
      }
    */
    if (!req.user || !req.user?.isAdmin) {
      throw new CustomError("Only admins can create customers", 403)
    }
    const data = await Customer.create(req.body);
    res.status(201).send({
      error: false,
      message: "Customer created successfully",
      data,
    });
  },
  read: async (req, res) => {
    /*
      #swagger.tags = ["Customers"]
      #swagger.summary = "Get Single Customer"
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }
    if (!req.user || !req.user?.isAdmin) {
      throw new CustomError("Only admins can view customers", 403)
    }
    const data = await Customer.findOne({ _id: id });
    if (!data) {
      throw new CustomError("Customer not found", 404);
    }
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /*
      #swagger.tags = ["Customers"]
      #swagger.summary = "Update Customer"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          $ref: "#/definitions/Customer"
        }
      }
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }
    const allowedFields = ["firstName", "lastName", "email", "phone", "address", "citizenshipId", "note"];
    if(!req.user || !req.user?.isAdmin) {
      throw new CustomError("Only admins can update customers", 403)
    }
    const filteredBody = {};
    for (let key in req.body) {
      if (allowedFields.includes(key)) {
        filteredBody[key] = req.body[key]
      }
    }
    const data = await Customer.findOneAndUpdate({ _id: id }, filteredBody, {returnDocument: "after", runValidators: true});
    if (!data) {
      throw new CustomError("Customer not found", 404);
    }
    res.status(200).send({
      error: false,
      message: "Customer updated successfully",
      data,
    });
  },
  changeCustomerStatus: async (req, res) => {
    /*
      #swagger.tags = ["Customers"]
      #swagger.summary = "Change Customer Status"
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }
    if(!req.user || !req.user?.isAdmin) {
      throw new CustomError("Only admins can change customer status", 403)
    }
    const customer = await Customer.findOne({ _id: id });
    if (!customer) {
      throw new CustomError("Customer not found", 404);
    }
    // Toggle the isActive status
    const newStatus = !(customer.isActive);
    const data = await Customer.findOneAndUpdate(
      { _id: id },
      { isActive: newStatus },
      { returnDocument: "after", runValidators: true },
    );
    if (!data) {
      throw new CustomError("Customer not found", 404);
    }
    res.status(200).send({
      error: false,
      message: `Customer status changed successfully. Now ${data.isActive ? "Active" : "Inactive"}`,
      data,
    });
  },
  delete: async (req, res) => {
    /*
      #swagger.tags = ["Customers"]
      #swagger.summary = "Hard Delete Customer"
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID format", 400);
    }
    if(!req.user || !req.user?.isAdmin) {
      throw new CustomError("Only admins can delete customers", 403)
    }
    const data = await Customer.findOneAndDelete({ _id: id });
    if (!data) {
      throw new CustomError("Customer not found", 404);
    }
    res.status(200).send({
      error: false,
      message: "Customer hard deleted successfully",
      data,
    });
  }
};
