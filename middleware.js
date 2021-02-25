module.exports.isLoggedIn = (req, res, next) => {
  // If user is not logged in, take them to the login page
  // .isAuthenticated() method on request automatically provided by passport
  if (!req.isAuthenticated()) {
    req.flash("error", "Please login to perform that action");
    return res.redirect("/login");
  }
  next();
};
