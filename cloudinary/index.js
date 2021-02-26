const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// CONFIGURE CLOUDINARY ACCESS
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// CONFIGURE CLOUDINARY STORAGE SETUP
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "TheHappyCamper",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
