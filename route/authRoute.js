const { registerUser, loginUser, logout, goTpDashboard } = require("../controller/authController")
const { authMiddleware } = require("../middlewares/authMiddleware")
// const authMiddleware = require("../middlewares/authMiddleware")

const router = require("express").Router()
// const {  } = require("../controllers/Admin.controller")


router
    .post("/register", registerUser)
    .post("/login", loginUser)
    .post("/logout", logout)
    .get("/dash", authMiddleware, goTpDashboard)
module.exports = router