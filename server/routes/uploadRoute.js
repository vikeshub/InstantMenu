const express = require('express');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const { uploadFile } = require('../controllers/uploadController');

const router = express.Router();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
