/** BizTime express application. */
//MOVED ROUTES TO SAME DIRECTORY//

const express = require("express");
const app = express();
const ExpressError = require("./expressError")

app.use(express.json());

const compRoutes = require("./companies");
app.use("/companies", compRoutes);
const invRoutes = require("./invoices");
app.use("/invoices", invRoutes);


app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});


app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
