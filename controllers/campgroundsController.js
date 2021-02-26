const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewCampgroundForm = (req, res) =>
  res.render("campgrounds/new");

module.exports.createCampground = async (req, res, next) => {
  // const campground = new Campground(req.body.campground);
  // campground.images = req.files.map((f) => ({
  //   url: f.path,
  //   filename: f.filename,
  // }));
  // campground.author = req.user._id;
  // await campground.save();
  // console.log(campground);
  // req.flash("success", "Successfully made a new campground!");
  // res.redirect(`/campgrounds/${campground._id}`);

  // If all expected data present, create the campground
  const campground = new Campground(req.body.campground);

  // Parse uploaded image to associated field name in campground schema
  // .files on request added by multer
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  // Add author _id to campground
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);

  req.flash("success", "Successfully created a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.findAndShowCampground = async (req, res) => {
  const { id } = req.params;
  // prettier-ignore
  const campground = await Campground.findById(id).populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  }).populate("author");

  if (!campground) {
    req.flash("error", "Campground not found!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditCampgroundForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Campground not found!");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit", { campground });
};

module.exports.editCampground = async (req, res) => {
  const { id } = req.params;

  await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash("success", "Successfully updated campground details!");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;

  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted that campground!");
  res.redirect("/campgrounds");
};
