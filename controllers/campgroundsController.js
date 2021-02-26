const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

// GET -> /campgrounds -> Campgrounds index page (campgrounds/index.ejs)
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

// GET -> /campgrounds/new -> Render new campground form (campgrounds/new.ejs)
module.exports.renderNewCampgroundForm = (req, res) =>
  res.render("campgrounds/new");

// POST -> /campgrounds -> Create new campground
module.exports.createCampground = async (req, res, next) => {
  // If all expected data present, create the campground
  const campground = new Campground(req.body.campground);

  // Parse uploaded image to associated field name in campground schema
  // .files on request added by multer
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  // Add author's ._id informtion to the campground entry
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

// GET -> /campgrounds/:id -> Find campground using id and display it (campgrounds/show.ejs)
module.exports.findAndShowCampground = async (req, res) => {
  // Find campground using id and populate nested reviews & author fields
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");

  // If campground not found,
  if (!campground) {
    // flash message and return to campgrounds index
    req.flash("error", "Campground not found!");
    return res.redirect("/campgrounds");
  }

  // Render campground show page
  res.render("campgrounds/show", { campground });
};

// GET -> /campgrounds/:id/edit -> Render campground edit form (campgrounds/edit.ejs)
module.exports.renderEditCampgroundForm = async (req, res) => {
  // Find campground that needs to be updated
  const { id } = req.params;
  const campground = await Campground.findById(id);

  // If campground not found,
  if (!campground) {
    // flash message and return to campgrounds index
    req.flash("error", "Campground not found!");
    return res.redirect("/campgrounds");
  }

  // Render campground edit form
  res.render("campgrounds/edit", { campground });
};

//  PUT -> /campgrounds/:id -> Edit campground details in db & cloudinary
module.exports.updateCampground = async (req, res) => {
  // Find campground that needs to be updated
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });

  // Push new images to the existing images array in campgrounds model
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);

  // Save the updated campground to DB
  await campground.save();

  // Delete selected images, is any, from cloudinary and remove schema associations
  if (req.body.deleteImages) {
    // remove from cloudinary
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }

    // remove entry of these images from the db
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  req.flash("success", "Successfully updated campground details!");
  res.redirect(`/campgrounds/${id}`);
};

// DELETE -> /campgrounds/:id -> Delete a campground
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;

  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted that campground!");
  res.redirect("/campgrounds");
};
