const authUserModel = require("../Modal/authUserModel");
const { nanoid } = require("nanoid"); // ✅ correct import
const bcrypt = require("bcryptjs");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
class authController {
    // REGISTER
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
                nanoid: nanoid(10), // ✅ generates unique ID of length 10
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

    // LOGIN
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
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, nanoid: user.nanoid },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,           // ✅ prevents JS access
            secure: process.env.NODE_ENV === "production", // use HTTPS in prod
            maxAge: 12 * 60 * 60 * 1000, // 12 hours
        });

        // Send response
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

            // Clear cookie
            res.clearCookie("token");
        } catch (error) {
            
        }
    }
    static async logoutController(req, res) {
    try {
        // Clear cookie with same options as set
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Logout failed" });
    }
}

}

module.exports = authController;
