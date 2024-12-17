const jwt = require('jsonwebtoken');
const User = require('../model/User');

exports.authMiddleware = async (req, res, next) => {
  const { user } = req.cookies;
  try {
    const decoded = jwt.verify(user, process.env.JWT_KEY);
    const userFromDb = await User.findById(decoded.userId);

    if (userFromDb.activeToken !== user) {
      console.log("User logged out due to token mismatch");


      return res.status(431).json({ message: "Logged out due to new login" });
    }

    // User is valid
    console.log("Token valid, user not cleared");
    req.user = decoded.userId;
    next();
  } catch (err) {
    console.log("Token verification error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};


