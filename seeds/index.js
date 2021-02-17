const mongoose = require("mongoose");
const Campground = require("../models/campground");

const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose
  .connect("mongodb://localhost:27017/happy-camper", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.log("❌ An Error Occured"));

// Helper Function
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// Seed data to the db
const seedDB = async () => {
  // delete all existing data before seeding new data
  await Campground.deleteMany({});

  // Create new locations
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * cities.length);
    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
    });
    await camp.save();
  }
};

// Execute the seed function
seedDB().then(() =>
  // close db connection when seeding complete
  mongoose.connection.close()
);
