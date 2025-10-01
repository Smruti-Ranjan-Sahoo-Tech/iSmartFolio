const authUserModel = require("../Modal/authUserModel");
const { nanoid } = require("nanoid"); // ✅ correct import
const bcrypt = require("bcryptjs");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
class authController {
    // LOGIN
static async loginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await authUserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, nanoid: user.nanoid },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    // Set cookie properly
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ only true on HTTPS
      sameSite: "none",                              // ✅ required for Netlify <-> Render
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

// LOGOUT
static async logoutController(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
}


}

module.exports = authController;
