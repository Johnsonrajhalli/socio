const Comment = require('../models/comment');
const Post = require('../models/post');

exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: 'Comment text required' });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({ post: postId, author: req.user.id, text });
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    const populated = await comment.populate('author', 'username profilePicture');
    res.status(201).json({ comment: populated });
  } catch (err) {
    console.error('createComment', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params; // comment id
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // allow deletion if author of comment or post author
    const post = await Post.findById(comment.post);
    if (String(comment.author) !== req.user.id && String(post.author) !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Comment.findByIdAndDelete(id);
    await Post.findByIdAndUpdate(post._id, { $inc: { commentsCount: -1 }});
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error('deleteComment', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId }).populate('author', 'username profilePicture').sort('-createdAt');
    res.json({ comments });
  } catch (err) {
    console.error('getCommentsForPost', err);
    res.status(500).json({ error: err.message });
  }
};
