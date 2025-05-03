const db = require('../config/db');

const planifySoutenance = async (req, res) => {
  const { sessionId, dateSoutenance, juryIds } = req.body;

  if (!sessionId || !dateSoutenance || !Array.isArray(juryIds) || juryIds.length < 3) {
    return res.status(400).json({ message: 'Session, date et au moins 3 jurys sont requis.' });
  }

  try {
    // Vérifier si la session existe
    const [session] = await db.query('SELECT * FROM sessions WHERE id = ?', [sessionId]);
    if (session.length === 0) {
      return res.status(404).json({ message: 'Session non trouvée' });
    }

    // Mettre à jour la date de soutenance
    await db.query('UPDATE sessions SET date_soutenance = ? WHERE id = ?', [dateSoutenance, sessionId]);

    // Supprimer les jurys existants
    await db.query('DELETE FROM session_jurys WHERE sessionId = ?', [sessionId]);

    // Ajouter les jurys
    const insertValues = juryIds.map(juryId => [sessionId, juryId]);
    await db.query('INSERT INTO session_jurys (sessionId, juryId) VALUES ?', [insertValues]);

    res.status(200).json({ message: 'Soutenance planifiée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la planification :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  planifySoutenance,
};
