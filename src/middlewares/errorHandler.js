"use strict";

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */
// app.use(errorHandler):

module.exports = (err, req, res, next) => {
  console.log(err);

  return res.status(res?.errorStatusCode || 400).send({
    error: true,
    message: err.message || "An Internal Server error occurred",
    cause: err.cause,
    body: req.body,
    // stack: err.stack
  });
};
