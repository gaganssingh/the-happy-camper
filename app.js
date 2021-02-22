// MODULE IMPORTS
require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// CUSTOM IMPORTS
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./validationSchemas");

// IMPORTED MODELS
const Campground = require("./models/campground");
const Review = require("./models/review");

// INIT THE APP
const app = express();

// MIDDLEWARES
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// HELPER FUNCTIONS -> TO BE MOVED TO SEPARATE FILE
// DATA VALIDATION - Campgrounds
const validateCampground = (req, res, next) => {
  // Check if all expected data present
  // If data missing from req body
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// DATA VALIDATION - Reviews
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

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
// Generic
app.get("/", (req, res) => {
  res.render("home");
});

// CAMPGROUNDS ROUTES
// Campgrounds index
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// Add a new campground -> SERVE THE FORM
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// Add a new campground -> POST request from the form
app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // If all expected data present, create the campground
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Find campground by id
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", { campground });
  })
);

// EDIT a campground -> SERVE THE FORM
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

// EDIT a campground -> PUT request from the form
app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${id}`);
  })
);

// DELETE route
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

// REVIEW ROUTES
app.post(
  "/campgrounds/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

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
