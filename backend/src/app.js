const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");
const commentsRoute = require("./routes/comments");
const likesRoute = require("./routes/likes");
const followRoute = require("./routes/follow");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// API routes mounted correctly for frontend
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentsRoute);
app.use("/api/likes", likesRoute);
app.use("/api/follow", followRoute);

app.get("/", (req, res) => {
    res.send("API Running...");
});

module.exports = app;
