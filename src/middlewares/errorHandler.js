"use strict";

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */
// app.use(errorHandler):

module.exports = (err, req, res, next) => {
  console.log("ErrorHandler caught:", err);

  const statusCode = err.statusCode || res?.errorStatusCode || 500;
//   const isDevelopment = process.env.NODE_ENV === "development";

  return res.status(statusCode).send({
    error: true,
    message: err.message || "An Internal Server error occurred",
    cause: err.cause,
    body: req.body,
    // stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    // cause: err.cause,
    // // Include req.body and stack trace ONLY in development mode for security reasons
    // ...(isDevelopment && { 
    //   body: req.body, 
    //   stack: err.stack 
    // })
  });
};
