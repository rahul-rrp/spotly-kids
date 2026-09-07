const express = require('express');
const router = express.Router();
const { getCastingCalls, getCastingCallById } = require('../controllers/casting.controller');

router.get('/', getCastingCalls);
router.get('/:id', getCastingCallById);

module.exports = router;
