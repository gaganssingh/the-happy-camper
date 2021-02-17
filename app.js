// MODULE IMPORTS
require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

// IMPORTED MODELS
const Campground = require("./models/campground");

// INIT THE APP
const app = express();

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

// test
app.get("/makeCampground", async (req, res) => {
  const camp = new Campground({
    title: "Algonquin Park",
    description:
      "A huge conservation site with numerous campgrounds open to the public.",
  });
  await camp.save();
  res.json(camp);
});

// SERVE THE APP
app.listen(process.env.PORT, () =>
  console.log(`[app]: http://localhost:${process.env.PORT}`)
);
