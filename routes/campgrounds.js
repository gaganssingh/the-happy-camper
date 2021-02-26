const express = require("express");
const router = express.Router();

// IMPORTED CONTROLLERS
const campgrounds = require("../controllers/campgrounds");

// CUSTOM IMPORTS
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

// GET -> All Campgrounds
router.get("/", catchAsync(campgrounds.index));

// GET -> Serve the new campground form
router.get("/new", isLoggedIn, campgrounds.renderNewCampgroundForm);

// POST -> Create a new campground
// prettier-ignore
router.post("/", isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// GET -> Find campground by id
router.get("/:id", catchAsync(campgrounds.findAndShowCampground));

// GET -> Serve the EDIT campground form
// prettier-ignore
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditCampgroundForm));

// PUT -> EDIT a campground logic
// prettier-ignore
router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground));

// DELETE route
// prettier-ignore
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
