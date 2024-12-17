const asyncHandler = require("express-async-handler")
const User = require("../model/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.registerUser = asyncHandler(async (req, res) => {
    const { password, email } = req.body
    const isFound = await User.findOne({ email })
    if (isFound) {
        return res.status(404).json({ message: "Email Already Exist" })
    }
    const hashPass = await bcrypt.hash(password, 10)
    await User.create({ ...req.body, password: hashPass })

    // await sendEmail({ to: email, subject: "Register Success", message: `<h1>welcome, ${req.body.name}</h1>` })
    res.json({ message: `${req.body.name} Register Success` })
})

exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Step 1: Find the user by email
    const result = await User.findOne({ email });
    if (!result) {
        return res.status(404).json({ message: "Email Not Found" });
    }

    // Step 2: Compare the password with the hashed password in the database
    const verify = await bcrypt.compare(password, result.password);
    if (!verify) {
        return res.status(404).json({ message: "Password does not match" });
    }

    // Step 3: Create a new token and save it as the active token in the database
    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "6h" });
    await User.findByIdAndUpdate(result._id, { activeToken: token });

    // Step 4: Send the token as a cookie
    res.cookie("user", token, { httpOnly: true, maxAge: 86400000 }); // 1 day expiration
    res.json({
        message: "Login success",
        result: {
            _id: result._id,
            email: result.email,
            token
        }
    });
});


exports.logout = asyncHandler(async (req, res) => {
    res.clearCookie("user")
    res.json({ message: "Logout success" })
})
exports.goTpDashboard = asyncHandler(async (req, res) => {
    const x = "Hi My Name is Ritesh"
    res.json({ message: "Dashboard Succes", result: x })
})

