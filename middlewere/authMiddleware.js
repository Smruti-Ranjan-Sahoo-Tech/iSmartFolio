const jwt = require('jsonwebtoken');

async function isLoggedIn(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        console.log(req.user)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(req.user);

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
}

async function isLoginChecker(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.send({ login: false, message: "You are not logged in" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.nanoid) {

            return res.send({ login: true, message: "You are logged in" });
        }
    } catch (error) {

        console.error(error);
        return res.send({ login: false, message: "You are not logged in" });
    }


}

module.exports = { isLoggedIn, isLoginChecker };
