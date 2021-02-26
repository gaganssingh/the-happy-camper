const express = require("express");
const router = express.Router();

// IMPORTED CONTROLLERS
const campgroundsController = require("../controllers/campgroundsController");

// CUSTOM IMPORTS
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

// GET -> All Campgrounds
router.get("/", catchAsync(campgroundsController.index));

// GET -> Serve the new campground form
router.get("/new", isLoggedIn, campgroundsController.renderNewCampgroundForm);

// POST -> Create a new campground
// prettier-ignore
router.post("/", isLoggedIn, validateCampground, catchAsync(campgroundsController.createCampground));

// GET -> Find campground by id
router.get("/:id", catchAsync(campgroundsController.findAndShowCampground));

// GET -> Serve the EDIT campground form
// prettier-ignore
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgroundsController.renderEditCampgroundForm));

// PUT -> EDIT a campground logic
// prettier-ignore
router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundsController.editCampground));

// DELETE route
// prettier-ignore
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgroundsController.deleteCampground));

module.exports = router;
