const express = require('express');
const router = express.Router();
const aboutMeService = require('../Controller/aboutMeController');


// ===== About Me =====
router.get('/',  aboutMeService.getAboutMe);
router.post('/',  aboutMeService.addAboutMe);
router.put('/',  aboutMeService.updateAboutMe);

// ===== Work Experience =====
router.post('/work',  aboutMeService.addWorkExperience);
router.put('/work/:expId',  aboutMeService.updateWorkExperience);
router.delete('/work/:expId',  aboutMeService.deleteWorkExperience);

// ===== Education =====
router.post('/education',  aboutMeService.addEducation);
router.put('/education/:eduId',  aboutMeService.updateEducation);
router.delete('/education/:eduId',  aboutMeService.deleteEducation);

module.exports = router;
