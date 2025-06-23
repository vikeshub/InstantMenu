const uploadFile = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Cloudinary multer-storage puts the public URL in req.file.path and req.file.filename
    res.status(200).json({
      message: "File uploaded successfully",
      imageUrl: req.file.path, // This should be the Cloudinary URL
      file: req.file, // For debugging, return the whole file object
    });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err.message, stack: err.stack });
  }
};

module.exports = { uploadFile };
