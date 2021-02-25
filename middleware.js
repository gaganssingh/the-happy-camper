module.exports.isLoggedIn = (req, res, next) => {
  // If user is not logged in, take them to the login page
  // .isAuthenticated() method on request automatically provided by passport
  if (!req.isAuthenticated()) {
    // Store user's intended location to redirect to after login
    req.session.returnTo = req.originalUrl;

    // Inform user the reason for seeing the login page
    req.flash("error", "Please login to perform that action");

    // Send user to login page
    return res.redirect("/login");
  }
  next();
};
