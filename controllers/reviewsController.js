// IMPORTED MODELS
const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  // Pull up the campground this review is associated with
  const { id } = req.params;
  const campground = await Campground.findById(id);

  // Create the review
  const review = new Review(req.body.review);
  // Add the author id info to the review
  review.author = req.user._id;
  // Push review onto the campground
  campground.reviews.push(review);

  // Save both the review and the campground
  await review.save();
  await campground.save();

  req.flash("success", "Successfully added your review!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  // from the campground db, delete the entry for this review
  // The $pull operator removes from an existing array all instances of a value or values that match a specified condition
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // from the review db, delete this review
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review!");
  res.redirect(`/campgrounds/${id}`);
};
