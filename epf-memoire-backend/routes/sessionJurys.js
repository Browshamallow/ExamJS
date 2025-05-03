const express = require('express');
const router = express.Router();
const { planifySoutenance } = require('../controllers/sessionJurysController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/planify', authenticateToken, authorizeRoles('admin'), planifySoutenance);

module.exports = router;
