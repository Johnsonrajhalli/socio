const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // adjust path to your auth middleware
const commentCtrl = require('../controllers/commentControllers');

// create comment on a post
router.post('/:postId', auth, commentCtrl.createComment);

// get comments for a post
router.get('/post/:postId', auth, commentCtrl.getCommentsForPost);

// delete a comment
router.delete('/:id', auth, commentCtrl.deleteComment);

module.exports = router;
