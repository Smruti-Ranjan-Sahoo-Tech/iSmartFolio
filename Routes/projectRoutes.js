const express = require('express')
const router = express.Router()
const projectService = require('../Controller/projectController')
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
            folder: 'profiles/projects',
            format: 'jpeg',
            public_id: file.originalname + '-' + Date.now(),
        };
    },
});

const prjectUpload = multer({ storage:storage});
router.get('/show',projectService.getProjects);
router.post('/add',prjectUpload.single('p_imgUrl'),projectService.addProject);
router.put('/update/:projectId',prjectUpload.single('p_imgUrl'),projectService.updateProject);
router.delete('/delete/:projectId',projectService.deleteProject);

module.exports = router;
