// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caption: { type: String, default: '' },
  media: { type: String },         // Cloudinary URL
  mediaType: { type: String },     // "image" | "video"
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  commentsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

postSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Post', postSchema);
