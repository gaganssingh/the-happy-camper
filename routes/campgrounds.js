const express = require("express");
const router = express.Router();

// IMPORT CONTROLLERS
const campgroundsController = require("../controllers/campgroundsController");

// CUSTOM IMPORTS
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

// ROUTES
router
  .route("/")
  .get(catchAsync(campgroundsController.index))
  .post(
    isLoggedIn,
    validateCampground,
    catchAsync(campgroundsController.createCampground)
  );

router
  .route("/new")
  .get(isLoggedIn, campgroundsController.renderNewCampgroundForm);

router
  .route("/:id")
  .get(catchAsync(campgroundsController.findAndShowCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgroundsController.editCampground)
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundsController.deleteCampground)
  );

router
  .route("/:id/edit")
  .get(
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundsController.renderEditCampgroundForm)
  );

module.exports = router;
