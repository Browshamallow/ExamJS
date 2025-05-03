const pool = require('../config/db');

exports.uploadMemoire = async (req, res) => {
  const { titre, description, encadreur_id } = req.body;
  const fichier = req.file?.filename;
  const etudiantId = req.user.id;

  if (!titre || !description || !fichier || !encadreur_id) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    await pool.query(
      `INSERT INTO memoires (titre, description, fichier, etudiant_id, encadreur_id, statut) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [titre, description, fichier, etudiantId, encadreur_id, 'en_attente']
    );
    res.status(201).json({ message: 'Mémoire ajouté avec succès.' });
  } catch (err) {
    console.error('Erreur insertion mémoire:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.getLibrary = async (req, res) => {
  try {
    const sql = `
      SELECT m.titre AS title, u.name AS author, YEAR(m.created_at) AS year, m.fichier AS pdfUrl
      FROM memoires m
      JOIN users u ON m.etudiant_id = u.id
      WHERE m.statut = 'valide'
    `;

    const [rows] = await pool.query(sql);

    const formatted = rows.map(memo => ({
      ...memo,
      pdfUrl: `http://localhost:5000/uploads/memoires/${memo.pdfUrl}`,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Erreur lors de la récupération des mémoires :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getMemoiresEncadreur = async (req, res) => {
  try {
    const encadreurId = req.user?.id;

    if (!encadreurId) {
      return res.status(401).json({ error: "Token invalide ou ID manquant" });
    }

    const sql = `
      SELECT m.*, u.name AS etudiant_nom
      FROM memoires m
      JOIN users u ON m.etudiant_id = u.id
      WHERE m.encadreur_id = ?
    `;

    const [rows] = await pool.query(sql, [encadreurId]);

    res.json(rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des mémoires encadreur :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.validateMemoire = async (req, res) => {
  try {
    const encadreurId = req.user.id;
    const memoireId = req.params.id;
    const { statut, commentaire } = req.body;

    if (!['valide', 'refuse'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const [memoire] = await pool.query(
      'SELECT * FROM memoires WHERE id = ? AND encadreur_id = ?',
      [memoireId, encadreurId]
    );

    if (memoire.length === 0) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à valider ce mémoire" });
    }

    await pool.query(
      'UPDATE memoires SET statut = ?, commentaire_validation = ? WHERE id = ?',
      [statut, commentaire || null, memoireId]
    );

    res.json({ message: `Mémoire ${statut} avec succès` });
  } catch (error) {
    console.error('Erreur lors de la validation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getMemoireByStudent = async (req, res) => {
  const studentId = req.params.id;

  try {
    const [rows] = await pool.query(
      `SELECT id, titre AS title, description, fichier AS filename, statut AS validation_status, commentaire_validation
       FROM memoires WHERE etudiant_id = ? LIMIT 1`,
      [studentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Aucun mémoire trouvé." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur récupération mémoire étudiant:", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
