const express = require('express');
const router = express.Router();
const { envoyerMessage, getMessages } = require('../controllers/suiviController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRoles('etudiant'), envoyerMessage);
router.get('/', authenticateToken, authorizeRoles('etudiant'), getMessages);

module.exports = router;
