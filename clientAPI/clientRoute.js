const express = require('express');
const router = express.Router();

// Import all models
const Hero = require('../Modal/heroModel');
const TechStack = require('../Modal/techStackModel');
const Project = require('../Modal/projects');
const AboutMe = require('../Modal/aboutMe');
const Contact = require('../Modal/contact');
const Theme = require('../Modal/theme')

// GET all user data by nanoid
router.get('/:getAllUserDataId', async (req, res) => {
    try {
        const { getAllUserDataId } = req.params;

        // Fetch data from all models
        const [hero, techStack, projects, aboutMe, contact,theme] = await Promise.all([
            Hero.findOne({ nanoid: getAllUserDataId }),
            TechStack.findOne({ nanoid: getAllUserDataId }),
            Project.findOne({ nanoid: getAllUserDataId }),
            AboutMe.findOne({ nanoid: getAllUserDataId }),
            Contact.findOne({ nanoid: getAllUserDataId }),
            Theme.findOne({nanoid:getAllUserDataId})
        ]);

        // Check if any data exists
        if (!hero && !techStack && !projects && !aboutMe && !contact && !theme) {
            return res.status(404).json({ success: false, message: "No user data found" });
        }

        // Return combined data
        res.status(200).json({
            success: true,
            data: {
                hero,
                theme,
                techStack,
                projects,
                aboutMe,
                contact
            }
        });
    } catch (error) {
        console.log("Error while fetching client data: ", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;
