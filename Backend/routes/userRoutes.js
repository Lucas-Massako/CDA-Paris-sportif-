const express = require('express');
const router  = express.Router();
const { getLeaderboard, getProfile } = require('../controllers/userController');
const { getFullProfile, updateProfile } = require('../controllers/profileController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/leaderboard',   verifyToken, getLeaderboard);
router.get('/profile',       verifyToken, getProfile);       // léger — utilisé par la navbar
router.get('/profile/full',  verifyToken, getFullProfile);   // complet — utilisé par profile.html
router.put('/profile',       verifyToken, updateProfile);

module.exports = router;
