const express = require("express");
const passport = require("passport");
const router = express.Router();

const User = require("../models/user");

const catchAsync = require("../utils/catchAsync");
const { route } = require("./campgrounds");

// GET - SERVE the registeration form
router.get("/register", (req, res) => {
  res.render("users/register");
});

// POST - Register a new user route
// prettier-ignore
router.post("/register", catchAsync(async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
  
    // Use passport plugin to create a new user while also hashing the password
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.flash("success", "Welcome to YelpCamp");
    res.redirect("/campgrounds");
  } catch (e) {
    req.flash("error", e.message)
    res.redirect("/register")
  }
}));

// GET - SERVE the Login a user form
router.get("/login", (req, res) => {
  res.render("users/login");
});

// POST - Login a user route
router.post(
  "/login",
  // Use built-in passport method to authenticate users
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  catchAsync(async (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/campgrounds");
  })
);

router.get("/logout", (req, res) => {
  // Logout using passport provided method .logout()
  req.logout();
  req.flash("success", "You have successfully logged out!");
  res.redirect("/campgrounds");
});

module.exports = router;
