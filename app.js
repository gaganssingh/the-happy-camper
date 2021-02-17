require("dotenv").config();
// MODULE IMPORTS
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

// INIT THE APP
const app = express();

// ROUTE HANDLERS
app.get("/", (req, res) => {
  res.send("Hello from The Happy Camper");
});

// INIT THE SERVER
app.listen(process.env.PORT, () =>
  console.log(`[app]: http://localhost:${process.env.PORT}`)
);
