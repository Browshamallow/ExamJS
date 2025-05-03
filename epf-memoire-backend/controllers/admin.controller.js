// controllers/admin.controller.js
const db = require('../config/db');

exports.getDashboardData = async (req, res) => {
  try {
    const [etudiants] = await db.query("SELECT COUNT(*) AS total FROM users WHERE role = 'etudiant'");
    const [encadreurs] = await db.query("SELECT COUNT(*) AS total FROM users WHERE role = 'encadreur'");
    const [memoires] = await db.query("SELECT COUNT(*) AS total FROM memoires");
    const [valides] = await db.query("SELECT COUNT(*) AS total FROM memoires WHERE statut = 'valide'");
    const [recents] = await db.query(`
      SELECT id, name, email, role, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    res.json({
      stats: {
        etudiants: etudiants[0].total,
        encadreurs: encadreurs[0].total,
        memoires: memoires[0].total,
        valides: valides[0].total,
      },
      recents,
    });
  } catch (err) {
    console.error("Erreur dashboard admin :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
