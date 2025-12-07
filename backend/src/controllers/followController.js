const User = require('../models/User');

exports.toggleFollow = async (req, res) => {
  try {
    const targetId = req.params.id;
    const meId = req.user.id;
    if (meId === targetId) return res.status(400).json({ message: 'Cannot follow yourself' });

    const target = await User.findById(targetId);
    const me = await User.findById(meId);
    if (!target) return res.status(404).json({ message: 'User not found' });

    const already = target.followers.some(id => String(id) === String(meId));
    if (already) {
      target.followers = target.followers.filter(id => String(id) !== String(meId));
      me.following = me.following.filter(id => String(id) !== String(targetId));
      await target.save();
      await me.save();
      return res.json({ following: false });
    } else {
      target.followers.push(meId);
      me.following.push(targetId);
      await target.save();
      await me.save();
      return res.json({ following: true });
    }
  } catch (err) {
    console.error('toggleFollow', err);
    res.status(500).json({ error: err.message });
  }
};
