// controllers/postControllers.js
const Post = require("../models/post");
const User = require("../models/User");

// Helper to format a post exactly as frontend expects
function formatPost(p) {
    return {
        _id: p._id,
        caption: p.caption || "",
        media: p.media || null,
        mediaType: p.mediaType || null,
        author: {
            _id: p.author?._id,
            username: p.author?.username || "Unknown",
            profilePicture: p.author?.profilePicture || ""
        },
        likes: p.likes || [],
        commentsCount: p.commentsCount || 0,
        createdAt: p.createdAt
    };
}

exports.getFeed = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate("author", "username profilePicture");
        res.json(posts.map(formatPost));
    } catch (error) {
        console.error("Feed Error:", error);
        res.status(500).json({ message: "Failed to load feed" });
    }
};

exports.getAllPosts = exports.getFeed;

exports.createPost = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { caption, media } = req.body;

        const post = new Post({
            author: userId,
            caption: caption || "",
            media: media || null,
            mediaType: media && String(media).includes(".mp4") ? "video" : "image"
        });

        await post.save();

        const populated = await Post.findById(post._id).populate("author", "username profilePicture");
        res.status(201).json(formatPost(populated));
    } catch (err) {
        console.error("Create Post Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const already = post.likes.some(id => id.toString() === userId);
        if (already) {
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            post.likes.push(userId);
        }
        await post.save();

        res.json({ liked: !already, likesCount: post.likes.length });
    } catch (err) {
        console.error("Like Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) return res.status(400).json({ message: "Comment required" });
        // Placeholder: implement comments model later.
        res.json({ message: "Comment added (placeholder)" });
    } catch (err) {
        console.error("Comment Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
