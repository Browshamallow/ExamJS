const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const memoireController = require('../controllers/memoireController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/memoires');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}_${file.originalname}`;
    cb(null, filename);
  }
});
const upload = multer({ storage });

// Upload mémoire
router.post('/', authenticateToken, upload.single('fichier'), memoireController.uploadMemoire);

// Bibliothèque des mémoires validés
router.get('/library', memoireController.getLibrary);

// Mémoires assignés à l'encadreur connecté
router.get('/encadreur', authenticateToken, memoireController.getMemoiresEncadreur);

// Validation d'un mémoire (PUT)
router.put('/:id/validation', authenticateToken, memoireController.validateMemoire);

// Mémoire d'un étudiant donné (accès étudiant uniquement)
router.get('/student/:id', authenticateToken, authorizeRoles('etudiant'), memoireController.getMemoireByStudent);

module.exports = router;
