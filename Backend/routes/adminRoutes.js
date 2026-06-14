const express  = require('express');
const router   = express.Router();
const { verifyToken }  = require('../middlewares/authMiddleware');
const { requireAdmin } = require('../middlewares/adminMiddleware');
const { getMatches, resolveMatch, autoResolve } = require('../controllers/adminController');

// Double protection : JWT valide + is_admin = true
router.get('/matches',              verifyToken, requireAdmin, getMatches);
router.put('/matches/:id/resolve',  verifyToken, requireAdmin, resolveMatch);
router.post('/auto-resolve',        verifyToken, requireAdmin, autoResolve);

module.exports = router;
