const db = require('../config/db');

// ============================
// GET - Tous les encadreurs
// ============================
const getAllEncadreurs = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email FROM users WHERE role = ?',
      ['encadreur']
    );
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des encadreurs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ============================
// GET - Encadreur sélectionné (par étudiant)
// ============================
const getSelectedSupervisor = async (req, res) => {
  const userId = req.user.id;

  try {
    const [result] = await db.query(`
      SELECT u.id, u.name, u.email 
      FROM users u
      JOIN encadrements e ON e.encadreur_id = u.id
      WHERE e.etudiant_id = ?
    `, [userId]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Aucun encadreur assigné." });
    }

    res.json(result[0]);
  } catch (err) {
    console.error('Erreur lors de la récupération de l’encadreur sélectionné:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ============================
// POST - Sélectionner un encadreur
// ============================
const assignSupervisor = async (req, res) => {
  const etudiantId = req.user.id;
  const { encadreurId } = req.body;

  try {
    // Vérifier s'il a déjà un encadreur
    const [existingRows] = await db.execute(
      'SELECT * FROM encadrements WHERE etudiant_id = ?',
      [etudiantId]
    );

    if (existingRows.length > 0) {
      return res.status(400).json({ error: 'Vous avez déjà sélectionné un encadreur.' });
    }

    // Insertion de l'encadrement
    await db.execute(
      'INSERT INTO encadrements (etudiant_id, encadreur_id, status) VALUES (?, ?, ?)',
      [etudiantId, encadreurId, 'en_attente']
    );

    res.status(201).json({ message: 'Encadreur sélectionné avec succès.' });
  } catch (error) {
    console.error('Erreur encadrement :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ============================
// GET - Étudiants d’un encadreur
// ============================
const getStudentsByEncadreur = async (req, res) => {
  const encadreurId = req.params.id;

  try {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.email
      FROM encadrements e
      JOIN users u ON e.etudiant_id = u.id
      WHERE e.encadreur_id = ?
    `, [encadreurId]);

    res.json(rows);
  } catch (err) {
    console.error('Erreur getStudentsByEncadreur:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ============================
// GET - Mémoires encadrés
// ============================
const getMemoiresByEncadreur = async (req, res) => {
  const encadreurId = req.params.id;

  try {
    const [rows] = await db.query(`
      SELECT * FROM memoires
      WHERE encadreur_id = ?
    `, [encadreurId]);

    res.json(rows);
  } catch (err) {
    console.error('Erreur getMemoiresByEncadreur:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ============================
// GET - Sessions encadrées
// ============================
const getSessionsByEncadreur = async (req, res) => {
  const encadreurId = req.params.id;

  try {
    const [rows] = await db.query(`
      SELECT s.*, u.name AS studentName
      FROM sessions s
      JOIN users u ON s.studentId = u.id
      WHERE s.supervisorId = ?
    `, [encadreurId]);

    res.json(rows);
  } catch (err) {
    console.error('Erreur getSessionsByEncadreur:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ============================
// GET - Soutenances où l'encadreur est jury
// ============================
const getSoutenancesByEncadreur = async (req, res) => {
  const encadreurId = req.params.id;

  try {
    const [rows] = await db.query(`
      SELECT s.*, u.name AS studentName
      FROM session_jurys sj
      JOIN sessions s ON sj.sessionId = s.id
      JOIN users u ON s.studentId = u.id
      WHERE sj.juryId = ?
        AND s.date_soutenance IS NOT NULL
    `, [encadreurId]);

    res.json(rows);
  } catch (err) {
    console.error('Erreur getSoutenancesByEncadreur:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ============================
// Exports
// ============================
module.exports = {
  getAllEncadreurs,
  getSelectedSupervisor,
  assignSupervisor,
  getStudentsByEncadreur,
  getMemoiresByEncadreur,
  getSessionsByEncadreur,
  getSoutenancesByEncadreur
};
