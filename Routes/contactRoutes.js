const express = require('express');
const router = express.Router();
const contactService = require('../Controller/contactController');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,  
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'profiles/social',
            format: 'jpeg',
            public_id: file.originalname + '-' + Date.now(),
        };
    },
});

const socialUpload = multer({ storage:storage});
router.get('/', contactService.getContact);
router.post('/', contactService.addContact);
router.put('/', contactService.updateContact);
router.post('/social', socialUpload.single('icon'), contactService.addSocialMedia);
router.put('/social/:socialId', socialUpload.single('icon'), contactService.updateSocialMedia);
router.delete('/social/:socialId', contactService.deleteSocialMedia);

module.exports = router;
