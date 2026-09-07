const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const { getMyChildren, getLatestJoinedKids, createChild } = require('../controllers/child.controller');

router.get('/latest', getLatestJoinedKids);
router.get('/', authenticateToken, getMyChildren);
router.post('/', authenticateToken, createChild);

module.exports = router;
