const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = require("./review");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

// GENERATE THUMBNAIL IMAGE FROM THE CLOUDINARY IMAGE URL
// This thumbnail is displayed on the edit campground's delete image section
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      // Storing GeoJSON data
      // Follows the GeoJSON specification
      // Format e.g. -> { type: 'Point', coordinates: [ -79.3849, 43.6529 ] }
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
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
  },
  opts
);

// VIRTUALS
CampgroundSchema.virtual("properties.HTMLpopup").get(function () {
  return `<strong>
  <a href="/campgrounds/${this._id}">${this.title}</a>
  </strong>
  <p>${this.description.substring(0, 15)}...</p>
  `;
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
