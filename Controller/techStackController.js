const techStackModel = require('../Modal/techStackModel')

class TechStackService {
    static async getTechStack(req, res) {
        try {
            const { nanoid } = req.user
            const userStack = await techStackModel.findOne({ nanoid })
            if (!userStack) {
                return res.status(404).json({ success: false, message: "No tech stack found for this user" });
            }
            res.json({ success: true, message: "Tech Stack fetched successfully", data: userStack })
        } catch (error) {
            console.error("Error fetching tech stack:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    static async addTechStack(req, res) {
        try {
            const { nanoid } = req.user
            const { stackName } = req.body
            const bodyUrl = req.body?.imgUrl
            const imgUrl = req.file?req.file.path : bodyUrl || undefined;
            if (!stackName || !imgUrl) {
                return res.status(400).json({ success: false, message: "stackName and imgUrl are required" });
            }
            let userStack = await techStackModel.findOne({ nanoid })
            if (!userStack) {
                //Create 1st time for user
                userStack = new techStackModel({
                    nanoid,
                    tStack: [{ imgUrl, stackName }]
                })
            } else {
                userStack.tStack.push({ imgUrl, stackName })
            }
            await userStack.save()
            res.status(201).json({ success: true, message: "Tech Stack added successfully", data: userStack })
        } catch (error) {
            console.error("Error adding tech stack:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    static async updateTechStack(req, res) {
        try {
            const { nanoid } = req.user; // from auth
            const { stackId } = req.params;
            const { stackName } = req.body;
            const imgUrl = req.file?.path || undefined;

            if (!stackId) {
                return res.status(400).json({ success: false, message: "stackId is required" });
            }

            const updatedStack = await techStackModel.findOneAndUpdate(
                { nanoid, "tStack._id": stackId },
                {
                    $set: {
                        "tStack.$.stackName": stackName,
                        "tStack.$.imgUrl": imgUrl
                    },
                },
                { new: true }
            );

            if (!updatedStack) {
                return res.status(404).json({ success: false, message: "Tech stack not found" });
            }

            res.status(200).json({ success: true, message: "Tech stack updated successfully", data: updatedStack });
        } catch (error) {
            console.error("Error updating tech stack:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    static async deleteTechStack(req, res) {
        try {
            const { nanoid } = req.user; // from auth
            console.log(req.params);

            const { stackId } = req.params;
            if (!stackId) {
                return res.status(400).json({ success: false, message: "stackId is required" });
            }
            const updatedStack = await techStackModel.findOneAndUpdate(
                { nanoid },
                { $pull: { tStack: { _id: stackId } } },
                { new: true }
            );
            if (!updatedStack) {
                return res.status(404).json({ success: false, message: "Tech stack not found" });
            }

            res.status(200).json({
                success: true,
                message: "Stack deleted successfully",
                data: updatedStack
            });

        } catch (error) {
            console.error("Error deleting tech stack:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
            
        }
    }

}
module.exports = TechStackService;