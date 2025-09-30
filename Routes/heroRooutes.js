const express = require('express');
const router = express.Router();
const heroService = require('../Controller/heroController');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

//configuring cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,  
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

//storage configuring

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // async code using `req` and `file`
        // ...
        return {
            folder: 'profiles/heroes',
            format: 'jpeg',
            public_id: file.originalname + '-' + Date.now(),
        };
    },
});

const profileUpload = multer({ storage:storage});

// Route to get all heroes
router.get('/show', heroService.getHeroes);

// Route to add a new hero
router.post('/add', profileUpload.single('imgUrl'), heroService.addHero);

// Route to update a hero
router.put('/update',profileUpload.single('imgUrl'), heroService.updateHero);

module.exports = router;