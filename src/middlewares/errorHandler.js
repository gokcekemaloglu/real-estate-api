"use strict";

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */
// app.use(errorHandler):

module.exports = (err, req, res, next) => {
  console.log("ErrorHandler caught:", err);

  const statusCode = err.statusCode || res?.errorStatusCode || 500;

  return res.status(statusCode).send({
    error: true,
    message: err.message || "An Internal Server error occurred",
    cause: err.cause,
    body: req.body,
    // stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};
