const jwt = require("jsonwebtoken");
require("dotenv").config();

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Debug log to check what the token payload contains
    console.log("Decoded token:", decoded);

    req.user = decoded; // This should contain { id: ... }
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(403).json({ msg: "Invalid token" });
  }
}

module.exports = authMiddleware;
