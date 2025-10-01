const authUserModel = require("../Modal/authUserModel");
const { nanoid } = require("nanoid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class authController {
  // ================= REGISTER =================
  static async registerController(req, res) {
    try {
      const { name, password, email } = req.body;

      // Validation
      if (!name || !password || !email) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if user exists
      const existingUser = await authUserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new authUserModel({
        nanoid: nanoid(10),
        name,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: newUser,
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

  // ================= LOGIN =================
  static async loginController(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check user exists
      const user = await authUserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, nanoid: user.nanoid },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
      );

      // Set cookie (works local + production)
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in prod (HTTPS)
        sameSite: "none", // required for cross-domain (Netlify frontend)
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

  // ================= LOGOUT =================
  static async logoutController(req, res) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      });
      return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
  }

  // ================= CHECK AUTH =================
  static async checkAuth(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await authUserModel.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  }
}

module.exports = authController;
