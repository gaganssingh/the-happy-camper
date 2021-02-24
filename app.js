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

// IMPORT ROUTES
const campgrounds = require("./routes/campgrounds");

// IMPORTED MODELS
const Campground = require("./models/campground");
const Review = require("./models/review");

// INIT THE APP
const app = express();

// MIDDLEWARES
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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

app.use("/campgrounds", campgrounds); // CAMPGROUNDS ROUTES

// Generic
app.get("/", (req, res) => {
  res.render("home");
});

// REVIEW ROUTES
// POST - a review
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

// DELETE - a review
app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    // from the campground db, delete the entry for this review
    // The $pull operator removes from an existing array all instances of a value or values that match a specified condition
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // from the review db, delete this review
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/campgrounds/${id}`);
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
