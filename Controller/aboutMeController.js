const aboutMeModel = require('../Modal/aboutMe');

class aboutMeService {
    static async getAboutMe(req, res) {
        try {
            const { nanoid } = req.user;
            const aboutMe = await aboutMeModel.findOne({ nanoid });
            if (!aboutMe) return res.status(404).json({ success: false, message: "About me info not found" });
            res.status(200).json({ success: true, data: aboutMe });
        } catch (error) {
            console.log("Error while getting about me info: ", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    static async addAboutMe(req, res) {
        try {
            const { nanoid } = req.user;
            const { about_me } = req.body;

            let userAbout = await aboutMeModel.findOne({ nanoid });
            if (userAbout) return res.status(400).json({ success: false, message: "About me info already exists" });

            userAbout = await aboutMeModel.create({ nanoid, about_me });
            res.status(201).json({ success: true, data: userAbout });
        } catch (error) {
            console.log("Error while adding about me: ", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    static async updateAboutMe(req, res) {
        try {
            const { nanoid } = req.user;
            const { about_me } = req.body;

            const updated = await aboutMeModel.findOneAndUpdate(
                { nanoid },
                { about_me },
                { new: true }
            );

            if (!updated) return res.status(404).json({ success: false, message: "About me info not found" });
            res.status(200).json({ success: true, data: updated });
        } catch (error) {
            console.log("Error while updating about me: ", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    static async addWorkExperience(req, res) {
        try {
            const { nanoid } = req.user;
            const workExp = req.body;

            const userAbout = await aboutMeModel.findOne({ nanoid });
            if (!userAbout) return res.status(404).json({ success: false, message: "About me info not found" });

            userAbout.w_experience.push(workExp);
            await userAbout.save();

            res.status(201).json({ success: true, data: userAbout });
        } catch (error) {
            console.log("Error while adding work experience: ", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    static async updateWorkExperience(req, res) {
        try {
            const { nanoid } = req.user;
            const { expId } = req.params;
            const updates = req.body;

            const updated = await aboutMeModel.findOneAndUpdate(
                { nanoid, "w_experience._id": expId },
                { $set: { "w_experience.$": updates } },
                { new: true }
            );

            if (!updated) return res.status(404).json({ success: false, message: "Work experience not found" });
            res.status(200).json({ success: true, data: updated });
        } catch (error) {
            console.log("Error while updating work experience: ", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    static async deleteWorkExperience(req, res) {
        try {
            const { nanoid } = req.user;
            const { expId } = req.params;

            const updated = await aboutMeModel.findOneAndUpdate(
                { nanoid },
                { $pull: { w_experience: { _id: expId } } },
                { new: true }
            );

            if (!updated) return res.status(404).json({ success: false, message: "Work experience not found" });
            res.status(200).json({ success: true, data: updated });
        } catch (error) {
            console.log("Error while deleting work experience: ", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    static async addEducation(req, res) {
        try {
            const { nanoid } = req.user;
            const edu = req.body;

            const userAbout = await aboutMeModel.findOne({ nanoid });
            if (!userAbout) return res.status(404).json({ success: false, message: "About me info not found" });

            userAbout.education.push(edu);
            await userAbout.save();

            res.status(201).json({ success: true, data: userAbout });
        } catch (error) {
            console.log("Error while adding education: ", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    static async updateEducation(req, res) {
        try {
            const { nanoid } = req.user;
            const { eduId } = req.params;
            const updates = req.body;

            const updated = await aboutMeModel.findOneAndUpdate(
                { nanoid, "education._id": eduId },
                { $set: { "education.$": updates } },
                { new: true }
            );

            if (!updated) return res.status(404).json({ success: false, message: "Education not found" });
            res.status(200).json({ success: true, data: updated });
        } catch (error) {
            console.log("Error while updating education: ", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    static async deleteEducation(req, res) {
        try {
            const { nanoid } = req.user;
            const { eduId } = req.params;

            const updated = await aboutMeModel.findOneAndUpdate(
                { nanoid },
                { $pull: { education: { _id: eduId } } },
                { new: true }
            );

            if (!updated) return res.status(404).json({ success: false, message: "Education not found" });
            res.status(200).json({ success: true, data: updated });
        } catch (error) {
            console.log("Error while deleting education: ", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}

module.exports = aboutMeService;
