const jwt = require('jsonwebtoken');
const User = require('../model/User');

exports.authMiddleware = async (req, res, next) => {
  const { user } = req.cookies;
  // console.log("-------------", process.env.JWT_KEY);
  // console.log("userr", user);
  if (process.env.JWT_KEY) {


    const decoded = jwt.verify(user, process.env.JWT_KEY);
    const userFromDb = await User.findById(decoded.userId);

    if (userFromDb.activeToken !== user) {
      console.log("User logged out due to token mismatch");
      res.clearCookie("user")

      return res.status(431).json({ message: "Logged out due to new login" });
    }

    // User is valid
    console.log("Token valid, user not cleared");
    req.user = decoded.userId;
    next();
  }

};


