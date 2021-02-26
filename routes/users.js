const express = require("express");
const passport = require("passport");
const router = express.Router();

// IMPORT CONTROLLERS
const usersController = require("../controllers/usersController");

const catchAsync = require("../utils/catchAsync");

// ROUTES
router
  .route("/register")
  .get(usersController.renderRegisterUserForm)
  .post(catchAsync(usersController.registerUser));

router
  .route("/login")
  .get(usersController.renderLoginForm)
  .post(
    // Use built-in passport method to authenticate users
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    catchAsync(usersController.login)
  );

router.route("/logout").get(usersController.logout);

module.exports = router;
