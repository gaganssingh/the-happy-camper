const express = require("express");
const router = express.Router();
const multer = require("multer");

// IMPORT CONTROLLERS
const campgroundsController = require("../controllers/campgroundsController");

// CUSTOM IMPORTS
const { storage } = require("../cloudinary");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

// CONFIGURE MULTER TO UPLOAD IMAGES TO CLOUDINARY
const upload = multer({ storage });

// ROUTES
router
  .route("/")
  .get(catchAsync(campgroundsController.index))
  .post(
    isLoggedIn,
    upload.array("image"),
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
    upload.array("image"),
    validateCampground,
    catchAsync(campgroundsController.updateCampground)
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
