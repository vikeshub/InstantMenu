const express = require('express');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const { uploadFile } = require('../controllers/uploadController');
const { authenticateJWT, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ storage });

router.post('/upload', authenticateJWT, authorizeRole(['restaurant_owner']), upload.single('file'), uploadFile);

module.exports = router;
