const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();


mongoose
    .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use("/api/auth", require("./route/authRoute"));

app.use("*", (req, res) => {
    res.status(404).json({ message: "Resource Not Found" });
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message || "Something went wrong" });
});

mongoose.connection.once("open", () => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
