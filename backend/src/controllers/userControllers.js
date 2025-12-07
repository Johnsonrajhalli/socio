const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("username email profilePicture bio");
        res.json(users);
    } catch (err) {
        console.error("Get Users Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("username email profilePicture bio followers following");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        console.error("Get User Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
