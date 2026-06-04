"use strict"

const multer = require("multer")
const path = require("path")
const CustomError = require ("../errors/customErrors")

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Files will be stored in public/uploads folder inside root directory
    cb(null, "./public/uploads/")
  },
  filename: (req, file, cb) => {
    // Generate a high-entropy unique filename using current timestamp and original file extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

// 2. Security Filter: Only allow images (.jpg, .jpeg, .png)

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/
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
