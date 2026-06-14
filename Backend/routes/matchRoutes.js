const express = require('express');
const router = express.Router();
const { getUpcomingMatches, getExternalCotes } = require('../controllers/matchController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/',              verifyToken, getUpcomingMatches);
router.post('/external-cotes', verifyToken, getExternalCotes);

module.exports = router;
