const express = require("express");
const router = express.Router();

// IMPORTED MODELS
const Campground = require("../models/campground");

// CUSTOM IMPORTS
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../validationSchemas");

// HELPER FUNCTIONS -> TO BE MOVED TO SEPARATE FILE
// DATA VALIDATION - Campgrounds
const validateCampground = (req, res, next) => {
  // Check if all expected data present
  // If data missing from req body
  const { error } = campgroundSchema.validate(req.body);
  console.log(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Campgrounds index
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// Add a new campground -> SERVE THE FORM
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

// Add a new campground -> POST request from the form
router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // If all expected data present, create the campground
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Find campground by id
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show", { campground });
  })
);

// EDIT a campground -> SERVE THE FORM
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

// EDIT a campground -> PUT request from the form
router.put(
  "/:id",
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
router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
