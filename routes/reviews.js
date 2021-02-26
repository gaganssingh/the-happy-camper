const express = require("express");
const router = express.Router({ mergeParams: true });

// IMPORTED CONTROLLERS
const reviewsController = require("../controllers/reviewsController");

// CUSTOM IMPORTS
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");

// POST - a review
// prettier-ignore
router.post("/", isLoggedIn, validateReview, catchAsync(reviewsController.createReview));

// DELETE - a review
// prettier-ignore
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviewsController.deleteReview));

module.exports = router;
