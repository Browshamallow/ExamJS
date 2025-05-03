const express = require('express');
const router = express.Router();
const {
  getAllEncadreurs,
  getStudentsByEncadreur,
  getMemoiresByEncadreur,
  getSoutenancesByEncadreur,
  getSessionsByEncadreur,
    getSelectedSupervisor,

} = require('../controllers/encadreurController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllEncadreurs);

router.get('/selected', authenticateToken, authorizeRoles('etudiant'), getSelectedSupervisor);

router.get('/users/encadreur/students/:id', authenticateToken, authorizeRoles('encadreur'), getStudentsByEncadreur);
router.get('/memoires/encadreur/:id', authenticateToken, authorizeRoles('encadreur'), getMemoiresByEncadreur);
router.get('/sessions/encadreur/:id', authenticateToken, authorizeRoles('encadreur'), getSessionsByEncadreur);
router.get('/soutenances/encadreur/:id', authenticateToken, authorizeRoles('encadreur'), getSoutenancesByEncadreur);
module.exports = router;
