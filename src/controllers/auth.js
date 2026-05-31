"use strict";

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const Token = require("../models/token");
const User = require("../models/user");

const CustomError = require("../errors/customErrors");
const bcrypt = require("bcrypt");

module.exports = {
  signup: async (req, res) => {
    /*
      #swagger.tags = ["Authentication"]
      #swagger.summary = "Signup"
      #swagger.description = 'Signup with username, email and password for create new user'
      #swagger.parameters["body"] = {
        in: "body",
        required: true,
        schema: {
          "username": "test",
          "email": "test@test.com",
          "password": "aA?123456",
          "firstName": "Test",    
          "lastName": "User"
        }
      }
    */
    const { userName, email, password, firstName, lastName } = req.body;
    console.log(req.body);
    
    if (!userName || !email || !password || !firstName || !lastName) {
      throw new CustomError("All fields are required", 400);
    }
    const user = await User.create({
      userName,
      email,
      password,
      firstName,
      lastName,
    });
    res.status(201).send({
      error: false,
      message: "User created successfully",
      data: user,
    });
  },
  login: async (req, res) => {
    /*
      #swagger.tags = ["Authentication"]
      #swagger.summary = "Login"
      #swagger.description = 'Login with username (or email) and password for get simpleToken and JWT'
      #swagger.parameters["body"] = {
        in: "body",
        required: true,
        schema: {
          "userName": "test",
          "password": "aA?123456",
        }
      }
    */
    const { userName, email, password } = req.body;
    // 1-Check if userName/email and password exist
    if (!((userName || email) && password)) {
      throw new CustomError("Username/email and password are required", 400);
    }

    // 2-Check if user exists and password is correct
    const user = await User.findOne({
      $or: [
        { userName: userName },
        { email: email }
      ],
    }).select("+password")

    if (!user) {
      throw new CustomError("Invalid username or password", 401);
    }

    // 3-Check if user is active
    if (!user.isActive) {
      throw new CustomError("This account is no longer active", 401);
    }

    // 4-Check password
    const isPasswordCorrect = await user.correctPassword(
      password,
      user.password,
    );
    console.log("isPasswordCorrect", isPasswordCorrect);
    if (!isPasswordCorrect) {
      throw new CustomError("Invalid username or password", 401);
    }

    console.log("user", user);

    // if (!user || !(await user.correctPassword(password))) {
    //   throw new CustomError("Invalid username or password", 401);
    // }

    // 5-If everything is okay, send token to client

    // Simple Token
    
  },
  refresh: async (req, res) => {},
  logout: async (req, res) => {},
};
