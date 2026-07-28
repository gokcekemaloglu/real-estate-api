"use strict"

const multer = require("multer")
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const path = require("path")
const CustomError = require ("../errors/customErrors")

// 1. Configure Cloudinary Environment Core Settings
// The SDK will automatically detect your process.env.CLOUDINARY_URL connection link string natively.
cloudinary.config({
  secure: true
});

// 2. Set up Cloudinary Storage Configuration Engine
// Replaced local diskStorage entirely with cloud-streaming pipeline buffers.
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "gorkem-emlak-portfolio", // Explicit folder naming indicator inside your Cloudinary Media Library Dashboard
    allowed_formats: ["jpg", "jpeg", "png", "webp"], // Supported explicit assets formats
    // Advanced Cloudinary Optimization: Converts any uploaded file instantly to modern .webp format 
    // and compresses it with dynamic AI constraints to maximize Google Lighthouse PageSpeed scores!
    transformation: [
      { width: 1200, height: 900, crop: "limit" }, // Caps heavy massive images to standardized framework metrics
      { quality: "auto" }, // Automated algorithmic quality reduction with zero visible pixelation degradation
      { fetch_format: "auto" } // Automatically delivers the most optimized format based on target visitor browsers
    ],
    public_id: (req, file) => {
      // Generate a high-entropy unique cloud asset identifier using timestamp tokens
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const cleanFileName = file.originalname.split(".")[0].replace(/[^a-zA-Z0-9_]/g, "");
      return `img-${cleanFileName}-${uniqueSuffix}`;
    }
  }
});

// 2. Security Filter: Only allow images (.jpg, .jpeg, .png, .webp)

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)
    if (extname && mimetype) {
        return cb(null, true)
    } else {
        // 2. Security Filter: Only allow images (.jpg, .jpeg, .png)
        return cb(new CustomError("Only .jpg, .jpeg, and .png files are allowed", 400), false)
    }
}

// 3. Set file size limit to 5MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})

module.exports = upload
