const express = require('express');
const router = express.Router();
const { placeBet, getBetHistory } = require('../controllers/betController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/place', verifyToken, placeBet);
router.get('/history', verifyToken, getBetHistory);

module.exports = router;
