const express = require('express');
const router = express.Router();
const multer = require('multer');
const mediaController = require('../controllers/mediaController');

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.post('/:phoneNumber/media', upload.single('media'), mediaController.uploadMedia);
router.get('/:mediaId', mediaController.getMediaUrl);
router.delete('/:mediaId', mediaController.deleteMedia);
router.get('/media/:mediaUrl', mediaController.downloadMedia)

module.exports = router;
