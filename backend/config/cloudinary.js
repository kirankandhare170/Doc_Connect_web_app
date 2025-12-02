const cloudinary = require('cloudinary').v2;
const dotenv = require("dotenv");

// Load env variables
dotenv.config();

// Configure Cloudinary
const connectCloudinary = () => {
  if (
    !process.env.CLOUDINARY_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_SECRET_KEY
  ) {
    throw new Error("Cloudinary credentials are missing in .env");
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });

  console.log("Cloudinary configured successfully");
};

module.exports = connectCloudinary;
