const express = require('express');
const { xemProfile, capNhatProfile, uploadAvatar } = require('../controllers/profileController');
const { xacThucToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', xacThucToken, xemProfile);
router.put('/', xacThucToken, capNhatProfile);
router.post('/upload-avatar', xacThucToken, upload.single('avatar'), uploadAvatar);

module.exports = router;

