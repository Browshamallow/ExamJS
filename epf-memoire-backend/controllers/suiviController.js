const db = require('../config/db');

const envoyerMessage = async (req, res) => {
  const { message } = req.body;
  const etudiantId = req.user.id;

  try {
    const [enc] = await db.query(
      'SELECT encadreurId FROM encadrements WHERE etudiantId = ?',
      [etudiantId]
    );
    if (enc.length === 0) {
      return res.status(400).json({ message: "Aucun encadreur assigné." });
    }

    const encadreurId = enc[0].encadreurId;

    await db.query(
      'INSERT INTO suivis (etudiantId, encadreurId, message) VALUES (?, ?, ?)',
      [etudiantId, encadreurId, message]
    );

    res.status(201).json({ message: 'Message envoyé à votre encadreur.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getMessages = async (req, res) => {
  const etudiantId = req.user.id;

  try {
    const [rows] = await db.query(
      `SELECT s.id, s.message, s.createdAt, u.name AS auteur 
       FROM suivis s 
       JOIN users u ON s.etudiantId = u.id OR s.encadreurId = u.id
       WHERE s.etudiantId = ?
       ORDER BY s.createdAt DESC`,
      [etudiantId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des messages." });
  }
};

module.exports = {
  envoyerMessage,
  getMessages,
};
