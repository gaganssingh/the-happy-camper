const express = require("express");
const router = express.Router({ mergeParams: true });

// IMPORTED MODELS
const Campground = require("../models/campground");
const Review = require("../models/review");

// CUSTOM IMPORTS
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { reviewSchema } = require("../validationSchemas");

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

// POST - a review
// prettier-ignore
router.post("/", validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // console.log(campground)

    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully added your review!")
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// DELETE - a review
// prettier-ignore
router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    // from the campground db, delete the entry for this review
    // The $pull operator removes from an existing array all instances of a value or values that match a specified condition
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // from the review db, delete this review
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!")
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
