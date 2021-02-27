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
  for (let i = 0; i < 10; i++) {
    const random1000 = Math.floor(Math.random() * cities.length);
    const randomPrice = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: { type: "Point", coordinates: [-79.3849, 43.6529] },
      author: "6037e49a41ec9408daede17e",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam dignissimos ut minima ad odio eos!",
      price: randomPrice,
      images: [
        {
          url:
            "https://res.cloudinary.com/dee1o1ghi/image/upload/v1614374923/TheHappyCamper/oli6lvyprgrs7jfqkctw.jpg",
          filename: "TheHappyCamper/oli6lvyprgrs7jfqkctw",
        },
        {
          url:
            "https://res.cloudinary.com/dee1o1ghi/image/upload/v1614374923/TheHappyCamper/pg5jenlspvygobtsa4s4.jpg",
          filename: "TheHappyCamper/pg5jenlspvygobtsa4s4",
        },
      ],
    });
    await camp.save();
  }
};

// Execute the seed function
seedDB().then(() => {
  console.log("Seeding DB........");
  // close db connection when seeding complete
  mongoose.connection.close();
  console.log("✅ Seeding DB Successfull");
});
