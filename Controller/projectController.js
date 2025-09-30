const projectModel = require('../Modal/projects')

class projectService {
  static async getProjects(req, res) {
    try {
      const { nanoid } = req.user
      const userProjects = await projectModel.findOne({ nanoid })
      if (!userProjects || userProjects.project.length === 0) {
        return res.status(404).json({ success: false, message: "Projects not found" })
      }
      res.status(200).json({ success: true, data: userProjects })
    } catch (error) {
      console.error("Error while getting projects:", error)
      res.status(500).json({ success: false, message: "Internal server error" })
    }
  }

  static async addProject(req, res) {
    try {
      const { nanoid } = req.user
      const { p_title, p_description, p_technologies, p_livePreview, p_viewCoads, p_imgUrl } = req.body
      const imageUrl = req.file?.path || p_imgUrl || ""
      const newProject = {
        p_imgUrl: imageUrl,
        p_title,
        p_description,
        p_technologies,
        p_livePreview,
        p_viewCoads,
      }
      const userProjects = await projectModel.findOneAndUpdate(
        { nanoid },
        { $push: { project: newProject } },
        { new: true, upsert: true }
      )
      res.status(201).json({ success: true, data: userProjects })
    } catch (error) {
      console.error("Error while adding project:", error)
      res.status(500).json({ success: false, message: "Internal server error" })
    }
  }

  static async updateProject(req, res) {
    try {
      const { nanoid } = req.user
      const { projectId } = req.params
      const { p_title, p_description, p_technologies, p_livePreview, p_viewCoads, p_imgUrl } = req.body
      const imageUrl = req.file?.path || p_imgUrl || ""
      const updatedUserProjects = await projectModel.findOneAndUpdate(
        { nanoid, "project._id": projectId },
        {
          $set: {
            "project.$": {
              _id: projectId,
              p_imgUrl: imageUrl,
              p_title,
              p_description,
              p_technologies,
              p_livePreview,
              p_viewCoads,
            },
          },
        },
        { new: true }
      )
      if (!updatedUserProjects) {
        return res.status(404).json({ success: false, message: "Project not found" })
      }
      res.status(200).json({ success: true, data: updatedUserProjects })
    } catch (error) {
      console.error("Error while updating project:", error)
      res.status(500).json({ success: false, message: "Internal server error" })
    }
  }

  static async deleteProject(req, res) {
    try {
      const { nanoid } = req.user
      const { projectId } = req.params
      const updatedUserProjects = await projectModel.findOneAndUpdate(
        { nanoid },
        { $pull: { project: { _id: projectId } } },
        { new: true }
      )
      if (!updatedUserProjects) {
        return res.status(404).json({ success: false, message: "User projects not found" })
      }
      res.status(200).json({ success: true, data: updatedUserProjects })
    } catch (error) {
      console.error("Error while deleting project:", error)
      res.status(500).json({ success: false, message: "Internal server error" })
    }
  }
}

module.exports = projectService
