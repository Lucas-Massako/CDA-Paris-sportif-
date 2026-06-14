const express = require('express');
const router = express.Router();
const { getUpcomingMatches } = require('../controllers/matchController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, getUpcomingMatches);

module.exports = router;
