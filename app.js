// MODULE IMPORTS
process.env.NODE_ENV !== "production" ? require("dotenv").config() : null;
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

// MODEL IMPORTS
const User = require("./models/user");

// CUSTOM IMPORTS
const ExpressError = require("./utils/ExpressError");

// IMPORT ROUTES
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

// SERVER CONNECTION - MAKE MONGODB TO APP CONNECTION
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/happy-camper";

mongoose
  .connect(dbUrl, {
    // .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.log("❌ An Error Occured"));

// INIT THE APP
const app = express();

// CONFIGURE SESSION STORAGE ON MONGODB
const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret: process.env.SECRET,
  touchAfter: 24 * 60 * 60,
});
store.on("error", (err) => console.log("Session store error", e));

const sessionConfig = {
  store, // User session storage on MongoDB
  name: "session",
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true, // Turn on to ONLY allow https connections
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // expires in a week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

// MIDDLEWARES
// SETUP EJS ENGINE AND SERVING DIRECTORY
app.engine("ejs", ejsMate); // EJS View Engine
app.set("view engine", "ejs"); // EJS View Engine
app.set("views", path.join(__dirname, "views")); //Setup the root directory serving the views
app.use(express.urlencoded({ extended: true })); // Parse info on req.body
app.use(methodOverride("_method")); // Override method keyword
app.use(express.static(path.join(__dirname, "public"))); // Root directory for serving static assets
app.use(session(sessionConfig)); // Cookie session storage
app.use(flash()); // Init flashing of messages upon task completion
app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); // Initialize session based login persistance for passport
app.use(mongoSanitize());
app.use(helmet());

// HELMET CONFIGURATION
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dee1o1ghi/",
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// INITIALIZE PASSPORT BY USING METHODS PROVIDED BY PASSPORT
// Use the authentication strategy located on the User model
passport.use(new LocalStrategy(User.authenticate()));

// Tell passport how to serialize / de-serialize user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// GLOBALS MIDDLWEARE SETUP
app.use((req, res, next) => {
  // From passport, get .user and make it available globally
  res.locals.currentUser = req.user;

  // FLASH MIDDLEWARE, so that if req.flash("success") / "error"
  // is available, it's available globally on res.locals.success / .error
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ROUTE HANDLERS
app.use("/", userRoutes); // USER ROUTES
app.use("/campgrounds", campgroundRoutes); // CAMPGROUNDS ROUTES
app.use("/campgrounds/:id/reviews", reviewRoutes); // REVIEW ROUTES

// Generic
app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// ERROR HANDLERS
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Oops! Something went terribly wrong";
  }
  res.status(statusCode).render("error", { err });
});

// SERVE THE APP
app.listen(process.env.PORT, () =>
  console.log(`[app]: http://localhost:${process.env.PORT}`)
);
