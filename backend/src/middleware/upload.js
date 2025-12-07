const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: "sociosphere_posts",
            resource_type: "auto" // allows image + video
        };
    }
});

const upload = multer({ storage });

module.exports = upload;
