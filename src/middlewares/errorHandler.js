"use strict";

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */
// app.use(errorHandler):

module.exports = (err, req, res, next) => {
  console.log("ErrorHandler caught:", err);

  let statusCode = err.statusCode || res?.errorStatusCode || 500;
  let message = err.message || "An Internal Server error occurred";

  // 1- Handle MongoDB Duplicate Key Errror (Code: 11000)
  if (err.code === 11000) {
    statusCode = 409; // Conflict
    // Dynamically extract the field name and value from the error message
    const duplicatedField = Object.keys(err.keyValue || {})[0]

    if (duplicatedField ==="userName") {
      message = "This username is already taken. Please choose another one.";
    } else if (duplicatedField ==="email") {
      message = "A user with that email already exists";
    } else {
      message = `This ${duplicatedField} is already in use.`;
    }
  }

  // 2- Handle Mongoose Validation Errors (e.g., missing required fields or validator failures)
  if (err.name === "ValidationError") {
    statusCode = 400; // Bad Request
    // Extract all validation error messages and concatenate them into a single string
    const validationMessages = Object.values(err.errors).map(e => e.message);
    message = validationMessages.join(", ");
  }

  // 3- Handle JWT Errors (e.g., invalid or expired tokens)
  if (err.name === "JsonWebTokenError") {
    statusCode = 401; // Unauthorized
    message = "Invalid token. Please log in again.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401; // Unauthorized
    message = "Your token has expired. Please log in again.";
  }

  // 4- Handle Mongoose CastError (e.g., sending an invalid ID format to MongoDB)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}.`;
  }
  
  // --- ENVIRONMENT BASED RESPONSE ---
  const isDevelopment = process.env.NODE_ENV === "development";

  return res.status(statusCode).send({
    error: true,
    message,
    // Provide sensitive details ONLY during development to help frontend/Postman debugging
    ...(isDevelopment && {
      cause: err.cause,
      body: req.body,
      stack: err.stack
    })
  });
};
