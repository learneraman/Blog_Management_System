const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) return res.status(401).json({ message: "No token" });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);

    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = user;
    next();
  } catch (err) {
    console.error("AuthMiddleware error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
