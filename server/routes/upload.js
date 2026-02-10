const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    // Clean filename: timestamp + original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter check
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! (jpg, jpeg, png, webp, gif)'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @route   POST /api/upload
// @desc    Upload an image
// @access  Public (or Private if you add auth middleware)
router.post('/', (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ success: false, error: err.message });
    }

    // Everything went fine.
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Construct full URL
    // For local development, we'll return the relative path that works with the proxy
    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(200).json(imageUrl);
    // Looking at frontend CreatePost.jsx: 
    // const { data } = await api.post(...) -> setImage(data)
    // So if I return JSON { url: ... }, frontend needs change.
    // Current frontend `CreatePost` expects `setImage(data)` where data is the path/url.
    // Previous implementation returned `res.send(...)` which is text/html usually unless json.
    // Let's stick to returning the string URL in the response body literal or a JSON object if client handles it.
    // The previous code was: res.send(`/${req.file.path...}`)
    // I will return the URL string directly to match typical `res.send` usage, but properly.
    // BUT `api.post` (axios) returns `data`. if I res.json("url"), data = "url". 
    // Correct.
  });
});

module.exports = router;
