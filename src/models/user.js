"use strict";

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const { mongoose } = require("../configs/dbConnection");
const validator = require("validator");
const validatePassword = require("../helpers/validatePassword");
const bcrypt = require("bcrypt");
const { comparePassword } = require("../helpers/methodHelper");

/* ------------------------------------------------------- *
User Model requirements
{
    "userName": "admin",
    "password": "aA?123456",
    "email": "admin@site.com",
    "firstName": "admin",
    "lastName": "admin"
}
/* ------------------------------------------------------- */

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      validate: {
        validator: validatePassword,
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
      select: false,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate: [validator.isEmail, "Please provide a valid e-mail address"],
      sparse: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      // Converts empty strings to null to prevent MongoDB unique index collision errors
      set: (value) => (value === "" || value === null || value === undefined ? undefined : value)
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "users",
    timestamps: true,
  },
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // console.log(bcrypt);
    this.password = await bcrypt.hash(this.password, 12);
  }
});

UserSchema.methods.correctPassword = comparePassword;

module.exports = mongoose.model("User", UserSchema);
