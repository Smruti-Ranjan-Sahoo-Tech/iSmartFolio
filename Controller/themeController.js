const themeModel = require('../Modal/theme')

class ThemeService {
  // Add or update theme
  static async addTheme(req,res) {
    try {
      const { theme } = req.body
      const { nanoid } = req.user

      // Check if theme exists
      const existingTheme = await themeModel.findOne({ nanoid })

      let result
      if (existingTheme) {
        // Update existing theme
        result = await themeModel.findOneAndUpdate(
          { nanoid },
          { theme },
          { new: true }
        )
      } else {
        // Add new theme
        result = await new themeModel({ nanoid, theme }).save()
      }

      return res.send({
        success: true,
        message: 'Theme added/updated successfully',
        data: result
      })
    } catch (error) {
      return res.send({
        success: false,
        message: error.message || 'Something went wrong'
      })
    }
  }

  // Get current theme
  static async getTheme(req,res) {
    try {
      const { nanoid } = req.user

      const userTheme = await themeModel.findOne({ nanoid })

      return res.send({
        success: true,
        message: 'Theme fetched successfully',
        data: userTheme || null
      })
    } catch (error) {
      return res.send({
        success: false,
        message: error.message || 'Something went wrong'
      })
    }
  }
}

module.exports = ThemeService
