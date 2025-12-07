// routes/posts.js
const express = require("express");
const auth = require("../middleware/auth"); // make sure this exports a middleware (req.user = ...)
const {
    getFeed,
    createPost,
    toggleLike,
    addComment,
    getAllPosts
} = require("../controllers/postControllers");

const router = express.Router();

router.get("/feed", auth, getFeed);
router.get("/", auth, getAllPosts);
router.post("/", auth, createPost);
router.post("/:id/like", auth, toggleLike);
router.post("/:id/comment", auth, addComment);

module.exports = router;
