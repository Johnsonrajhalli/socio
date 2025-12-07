const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const followCtrl = require('../controllers/followControllers');

router.post('/:id/toggle', auth, followCtrl.toggleFollow);

module.exports = router;
