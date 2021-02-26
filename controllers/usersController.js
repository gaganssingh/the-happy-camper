const User = require("../models/user");

module.exports.renderRegisterUserForm = (req, res) =>
  res.render("users/register");

module.exports.registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });

    // Use passport plugin to create a new user while also hashing the password
    const registeredUser = await User.register(user, password);

    // Automatically log in the new user and redirect
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to YelpCamp");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLoginForm = (req, res) => res.render("users/login");

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back!");

  // Capture the page to redirect to
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  // Logout using passport provided method .logout()
  req.logout();
  req.flash("success", "You have successfully logged out!");
  res.redirect("/campgrounds");
};
