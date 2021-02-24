// MODULE IMPORTS
require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// CUSTOM IMPORTS
const ExpressError = require("./utils/ExpressError");

// IMPORT ROUTES
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

// INIT THE APP
const app = express();

// MIDDLEWARES
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// MAKE MONGODB TO APP CONNECTION
mongoose
  .connect("mongodb://localhost:27017/happy-camper", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.log("❌ An Error Occured"));

// SETUP EJS ENGINE AND SERVING DIRECTORY
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ROUTE HANDLERS
app.use("/campgrounds", campgrounds); // CAMPGROUNDS ROUTES
app.use("/campgrounds/:id/reviews", reviews); // REVIEW ROUTES

// Generic
app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// ERROR HANDLERS
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Oops! Something went terribly wrong";
  }
  res.status(statusCode).render("error", { err });
});

// SERVE THE APP
app.listen(process.env.PORT, () =>
  console.log(`[app]: http://localhost:${process.env.PORT}`)
);
