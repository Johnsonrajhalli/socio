const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const likeCtrl = require('../controllers/likeControllers');

router.post('/:postId/toggle', auth, likeCtrl.toggleLike);

module.exports = router;
