const express = require('express');
const router = express.Router();
const { assignSupervisor } = require('../controllers/encadreurController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRoles('etudiant'), assignSupervisor);

module.exports = router;
