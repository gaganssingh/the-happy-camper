const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = require("./review");

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: {
    // Reference to the user schema
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    // Reference to the reviews schema
    // Array of reviews -> One-To-Many relationship
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// MIDDLEWARES
// Triggered when findByIdAndDelete is called and successful
// https://mongoosejs.com/docs/api.html#model_Model.findByIdAndDelete
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  // What is doc? after running findOneAndDelete, the document that is deleted is
  // passed onto this post middleware
  if (doc) {
    // Delete all reviews whose IDs are present in the campground.reviews
    // document that was just deleted
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
