const contactModel = require('../Modal/contact');

class contactService {
    static async getContact(req, res) {
        try {
            const { nanoid } = req.user;
            const contact = await contactModel.findOne({ nanoid });
            if (!contact) return res.status(404).json({ success: false, message: "Contact info not found" });
            res.status(200).json({ success: true, data: contact });
        } catch (error) {
            console.log("Error while getting contact info: ", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    static async addContact(req, res) {
        try {
            const { nanoid } = req.user;
            const { phone, email, socialMedias } = req.body;

            let userContact = await contactModel.findOne({ nanoid });
            if (userContact) return res.status(400).json({ success: false, message: "Contact info already exists" });

            userContact = await contactModel.create({ nanoid, phone, email, socialMedias });
            res.status(201).json({ success: true, data: userContact });
        } catch (error) {
            console.log("Error while adding contact info: ", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    static async updateContact(req, res) {
        try {
            const { nanoid } = req.user;
            const { phone, email } = req.body;

            const updated = await contactModel.findOneAndUpdate(
                { nanoid },
                { phone, email },
                { new: true }
            );

            if (!updated) return res.status(404).json({ success: false, message: "Contact info not found" });
            res.status(200).json({ success: true, data: updated });
        } catch (error) {
            console.log("Error while updating contact info: ", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    static async addSocialMedia(req, res) {
        try {
            const { nanoid } = req.user;
            const { name, your_Link } = req.body;
            const iconFromBody = (req.body?.icon || '').toString().trim();
            const iconFromFile = req.file?.path;
            const icon = iconFromFile || iconFromBody;

            if (!name || !your_Link || !icon) {
                return res.status(400).json({ success: false, message: "Missing required fields" });
            }

            const userContact = await contactModel.findOne({ nanoid });
            if (!userContact) return res.status(404).json({ success: false, message: "Contact info not found" });

            userContact.socialMedias.push({ name, icon, your_Link });
            await userContact.save();

            res.status(201).json({ success: true, data: userContact });
        } catch (error) {
            console.log("Error while adding social media: ", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    static async updateSocialMedia(req, res) {
        try {
            const { nanoid } = req.user;
            const { socialId } = req.params;
            const updates = { ...req.body };

            if (req.file?.path) {
                updates.icon = req.file.path;
            }

            const updated = await contactModel.findOneAndUpdate(
                { nanoid, "socialMedias._id": socialId },
                { $set: { "socialMedias.$": updates } },
                { new: true }
            );

            if (!updated) return res.status(404).json({ success: false, message: "Social media not found" });
            res.status(200).json({ success: true, data: updated });
        } catch (error) {
            console.log("Error while updating social media: ", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    static async deleteSocialMedia(req, res) {
        try {
            const { nanoid } = req.user;
            const { socialId } = req.params;

            const updated = await contactModel.findOneAndUpdate(
                { nanoid },
                { $pull: { socialMedias: { _id: socialId } } },
                { new: true }
            );

            if (!updated) return res.status(404).json({ success: false, message: "Social media not found" });
            res.status(200).json({ success: true, data: updated });
        } catch (error) {
            console.log("Error while deleting social media: ", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}

module.exports = contactService;
