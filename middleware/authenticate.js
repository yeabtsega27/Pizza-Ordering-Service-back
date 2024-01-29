// create authenticte middleware with admin and user
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization.split(" ")[1];
    // Verify token
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    // Find user by id
    const user = await User.findByPk(payload.id);
    // Attach user to request object
    req.user = user;
    // Call next middleware
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Not authorized" });
  }
};

const authenticateAdmin = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization.split(" ")[1];
    // Verify token
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    // Find user by id
    const user = await User.findByPk(payload.id);
    // Attach user to request object
    req.user = user;
    // Call next middleware
    if (user.role === "admin") {
      next();
    } else {
      res.status(401).json({ error: "Not authorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Not authorized" });
  }
};

module.exports = {
  authenticate,
  authenticateAdmin,
};
