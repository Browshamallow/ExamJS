const express = require('express');
const router = express.Router();
const {
  createUser,
  getEtudiants,
  getEncadreurs,
  getUsers,
  deleteUser,
  updateUser,
} = require('../controllers/user.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/create', authenticateToken, authorizeRoles('admin'), createUser);

router.get('/etudiants', authenticateToken, authorizeRoles('admin'), getEtudiants);
router.get('/encadreurs', authenticateToken, authorizeRoles('admin'), getEncadreurs);
router.get('/', authenticateToken, authorizeRoles('admin'), getUsers);

router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteUser);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateUser);

module.exports = router;
