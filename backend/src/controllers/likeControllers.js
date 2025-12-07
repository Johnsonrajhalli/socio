const Post = require('../models/post');

exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const already = post.likes.some(id => String(id) === String(userId));
    if (already) {
      post.likes = post.likes.filter(id => String(id) !== String(userId));
      await post.save();
      return res.json({ liked: false, likesCount: post.likes.length });
    } else {
      post.likes.push(userId);
      await post.save();
      return res.json({ liked: true, likesCount: post.likes.length });
    }
  } catch (err) {
    console.error('toggleLike', err);
    res.status(500).json({ error: err.message });
  }
};
