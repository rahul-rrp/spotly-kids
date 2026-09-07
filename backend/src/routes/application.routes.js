const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const { applyForCastingCall, getMyApplications } = require('../controllers/application.controller');

router.post('/', authenticateToken, applyForCastingCall);
router.get('/my-applications', authenticateToken, getMyApplications);

module.exports = router;
