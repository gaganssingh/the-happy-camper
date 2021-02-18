// MODULE IMPORTS
require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// CUSTOM IMPORTS
const catchAsync = require("./utils/catchAsync");

// IMPORTED MODELS
const Campground = require("./models/campground");

// INIT THE APP
const app = express();

// MIDDLEWARES
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// MAKE MONGODB TO APP CONNECTION
mongoose
  .connect("mongodb://localhost:27017/happy-camper", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.log("❌ An Error Occured"));

// SETUP EJS ENGINE AND SERVING DIRECTORY
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ROUTE HANDLERS
app.get("/", (req, res) => {
  res.render("home");
});

// Campgrounds index
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// Add a new campground -> SERVE THE FORM
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// Add a new campground -> POST request from the form
app.post(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Find campground by id
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", { campground });
  })
);

// EDIT a campground -> SERVE THE FORM
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

// EDIT a campground -> PUT request from the form
app.put(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${id}`);
  })
);

// DELETE route
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

// ERROR HANDLERS
app.use((err, req, res, next) => {
  res.send("🔥 EVERYTHING WENT TO HELL!!!! 🔥");
});

// SERVE THE APP
app.listen(process.env.PORT, () =>
  console.log(`[app]: http://localhost:${process.env.PORT}`)
);
