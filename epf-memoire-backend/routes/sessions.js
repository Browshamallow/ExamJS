const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const sessionController = require('../controllers/sessionController');

// Créer une session (admin)
router.post('/', authenticateToken, authorizeRoles('admin'), sessionController.createSession);

// Récupérer toutes les sessions (admin)
router.get('/', authenticateToken, authorizeRoles('admin'), sessionController.getAllSessions);

// Récupérer sessions étudiant connecté
router.get('/student', authenticateToken, sessionController.getStudentSessions);

// Récupérer sessions encadreur connecté
router.get('/encadreur', authenticateToken, authorizeRoles('encadreur'), sessionController.getSupervisorSessions);

// Planification de soutenance (admin)
router.post('/planify', authenticateToken, authorizeRoles('admin'), sessionController.planifySoutenance);

// Voir soutenances du jury (encadreur)
router.get('/jury', authenticateToken, authorizeRoles('encadreur'), sessionController.getJurySoutenances);

module.exports = router;
