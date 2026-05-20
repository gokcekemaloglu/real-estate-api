"use strict";

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const User = require("../models/user");

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
    const newUser = await User.create({
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    });
    const data = await User.create({newUser});
    
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
      return res.status(400).send({
        error: true,
        message: "Invalid ID format",
      });
    }
    const data = await User.findOne({ _id: id });
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
      return res.status(400).send({
        error: true,
        message: "Invalid ID format",
      });
    }
    const allowedFields = [
      "userName",
      "password",
      "email",
      "firstName",
      "lastName",
      "isAdmin",
    ];
    const filteredBody = {};
    for (let key in req.body) {
      if (allowedFields.includes(key)) {
        filteredBody[key] = req.body[key];
      }
    }
    const data = await User.findOneAndUpdate({ _id: id }, filteredBody, {
      returnDocument: "after",
      runValidators: true,
    });
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
    /* 
      #swagger.tags = ["Users"]
      #swagger.summary = "Delete User"
    */
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: true,
        message: "Invalid ID format",
      });
    }
    const data = await User.findOneAndUpdate(
      { _id: id },
      { isActive: false, isAdmin: false },
      { returnDocument: "after", runValidators: true },
    );
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
  changeUserStatus: async (req, res) => {
    /* 
      #swagger.tags = ["Users"]
      #swagger.summary = "Change User Status"
    */

    const userId = req.user.isAdmin ? req.params.id : req.user._id;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).send({
        error: true,
        message: req.t(translations.user.notFound),
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    // If the user is deactivated:
    if (!user.isActive) {
      const appointments = await Appointment.find({ userId: user._id });

      // Delete all appointments related to the user
      await Appointment.deleteMany({ userId: user._id });
      for (const appointment of appointments) {
        await TherapistTimeTable.updateOne(
          { therapistId: appointment.therapistId },
          {
            $pull: {
              unavailableDates: {
                date: appointment.appointmentDate,
                startTime: appointment.startTime,
                endTime: appointment.endTime,
              },
            },
          }
        );
      }
    }

    const message = deleteAccountEmail(user.userName);

    await sendEmail({
      email: user.email,
      subject:
        "Your Soul Journey Account Has Been Deleted – Come Back to Soul Journey Anytime",
      message,
    });

    res.status(200).send({
      error: false,
      message: req.t(translations.user.statusChanged, {
        status: user.isActive
          ? req.t(translations.user.active)
          : req.t(translations.user.disabled),
      }),
      data: user,
    });
  },
};
