const Campground = require("./models/campground");
const Review = require("./models/review");
const { campgroundSchema, reviewSchema } = require("./validationSchemas");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  // If user is not logged in, take them to the login page
  // .isAuthenticated() method on request automatically provided by passport
  if (!req.isAuthenticated()) {
    // Store user's intended location to redirect to after login
    req.session.returnTo = req.originalUrl;

    // Inform user the reason for seeing the login page
    req.flash("error", "You must be logged in to do that.");

    // Send user to login page
    return res.redirect("/login");
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
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

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  // Check if logged in user is authorized to Modify the campground
  // (check if logged in user is same as the user that create the campground)
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to edit that campground.");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  // Check if logged in user is authorized to Modify the campground
  // (check if logged in user is same as the user that create the campground)
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to edit that campground.");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// DATA VALIDATION - Reviews
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
