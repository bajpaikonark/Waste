const express = require("express");
const router = express.Router();
const upload = require("../config/cloudinary");

router.post("/image", (req, res) => {
  upload.single("image")(req, res, function (err) {
    if (err) {
      console.error("Upload middleware error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }

    console.log("File received:", req.file);

    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const imageUrl = req.file.path || req.file.secure_url;
    res.json({ success: true, imageUrl });
  });
});

module.exports = router;