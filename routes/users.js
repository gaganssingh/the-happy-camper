const express = require("express");
const passport = require("passport");
const router = express.Router();

// IMPORT CONTROLLERS
const usersController = require("../controllers/usersController");

const catchAsync = require("../utils/catchAsync");
const { route } = require("./campgrounds");

// GET - SERVE the registeration form
router.get("/register", usersController.renderRegisterUserForm);

// POST - Register a new user route
router.post("/register", catchAsync(usersController.registerUser));

// GET - SERVE the Login a user form
router.get("/login", usersController.renderLoginForm);

// POST - Login a user route
router.post(
  "/login",
  // Use built-in passport method to authenticate users
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  catchAsync(usersController.login)
);

// GET -> Logout user
router.get("/logout", usersController.logout);

module.exports = router;
