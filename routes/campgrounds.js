const express = require("express");
const router = express.Router();

// IMPORTED MODELS
const Campground = require("../models/campground");

// CUSTOM IMPORTS
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../validationSchemas");
const { isLoggedIn } = require("../middleware");

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

// Campgrounds index
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// GET -> Serve the new campground form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// POST -> Create a new campground
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    // If all expected data present, create the campground
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();

    req.flash("success", "Successfully created a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// GET -> Find campground by id
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    // prettier-ignore
    const campground = await Campground.findById(id).populate("reviews").populate("author");

    if (!campground) {
      req.flash("error", "Campground not found!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

// GET -> Serve the EDIT campground form
router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Campground not found!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

// PUT -> EDIT a campground logic
router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground details!");
    res.redirect(`/campgrounds/${id}`);
  })
);

// DELETE route
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted that campground!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
