const express = require("express");
const router = express.Router({ mergeParams: true });

// IMPORT CONTROLLERS
const reviewsController = require("../controllers/reviewsController");

// CUSTOM IMPORTS
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");

// ROUTES
router
  .route("/")
  .post(isLoggedIn, validateReview, catchAsync(reviewsController.createReview));

router
  .route("/:reviewId")
  .delete(
    isLoggedIn,
    isReviewAuthor,
    catchAsync(reviewsController.deleteReview)
  );

module.exports = router;
