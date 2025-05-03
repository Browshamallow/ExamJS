const pool = require('../config/db');

// Créer une session (admin)
exports.createSession = async (req, res) => {
  const { titre, studentId, supervisorId, date, time, salle } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO sessions (titre, studentId, supervisorId, date, time, salle) VALUES (?, ?, ?, ?, ?, ?)',
      [titre, studentId, supervisorId, date, time, salle]
    );
    res.status(201).json({ id: result.insertId, titre, studentId, supervisorId, date, time, salle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur création session', error });
  }
};

// Récupérer toutes les sessions avec noms (admin)
exports.getAllSessions = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.id, s.titre, s.date, s.time, s.salle,
        s.studentId, s.supervisorId,
        stu.name AS studentName,
        sup.name AS supervisorName
      FROM sessions s
      JOIN users stu ON s.studentId = stu.id
      JOIN users sup ON s.supervisorId = sup.id
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur récupération sessions' });
  }
};

// Récupérer sessions + soutenance + jurys pour un étudiant connecté
exports.getStudentSessions = async (req, res) => {
  const studentId = req.user.id;

  try {
    const [sessions] = await pool.query(`
      SELECT s.id, s.titre, s.salle, s.date, s.time, u.name AS supervisorName
      FROM sessions s
      JOIN users u ON s.supervisorId = u.id
      WHERE s.studentId = ? AND s.date_soutenance IS NULL
    `, [studentId]);

    const [soutenanceRows] = await pool.query(`
      SELECT s.id, s.titre, s.salle, s.date_soutenance AS date, s.time, u.name AS supervisorName
      FROM sessions s
      JOIN users u ON s.supervisorId = u.id
      WHERE s.studentId = ? AND s.date_soutenance IS NOT NULL
      LIMIT 1
    `, [studentId]);

    let soutenance = soutenanceRows[0] || null;
    let jurys = [];

    if (soutenance) {
      const [juryRows] = await pool.query(`
        SELECT u.id, u.name
        FROM session_jurys sj
        JOIN users u ON sj.juryId = u.id
        WHERE sj.sessionId = ?
      `, [soutenance.id]);

      jurys = juryRows;
    }

    res.json({ sessions, soutenance, jurys });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des sessions" });
  }
};

// Récupérer sessions encadreur connecté
exports.getSupervisorSessions = async (req, res) => {
  const supervisorId = req.user.id;
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.id,
        s.titre,
        s.salle,
        s.date,
        s.time,
        u.name AS studentName
      FROM sessions s
      JOIN users u ON s.studentId = u.id
      WHERE s.supervisorId = ?
    `, [supervisorId]);
    
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur récupération sessions encadreur' });
  }
};

// Planification de soutenance (admin)
exports.planifySoutenance = async (req, res) => {
  const { sessionId, dateSoutenance, juryIds } = req.body;

  if (!sessionId || !dateSoutenance || !Array.isArray(juryIds) || juryIds.length < 3) {
    return res.status(400).json({ message: 'Champs manquants ou jurys insuffisants' });
  }

  try {
    await pool.query('UPDATE sessions SET dateSoutenance = ? WHERE id = ?', [dateSoutenance, sessionId]);
    await pool.query('DELETE FROM session_jurys WHERE sessionId = ?', [sessionId]);

    for (const juryId of juryIds) {
      await pool.query('INSERT INTO session_jurys (sessionId, juryId) VALUES (?, ?)', [sessionId, juryId]);
    }

    res.status(200).json({ message: 'Soutenance planifiée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la planification', error });
  }
};

// Voir les soutenances d'un jury (encadreur)
exports.getJurySoutenances = async (req, res) => {
  const juryId = req.user.id;

  try {
    const [rows] = await pool.query(`
      SELECT 
        s.id,
        s.titre,
        s.date_soutenance AS date,
        s.time,
        s.salle,
        stu.name AS studentName,
        sup.name AS supervisorName
      FROM session_jurys sj
      JOIN sessions s ON sj.sessionId = s.id
      JOIN users stu ON s.studentId = stu.id
      JOIN users sup ON s.supervisorId = sup.id
      WHERE sj.juryId = ? AND s.date_soutenance IS NOT NULL
      ORDER BY s.date_soutenance DESC
    `, [juryId]);

    res.json(rows);
  } catch (error) {
    console.error('Erreur récupération des soutenances jury :', error);
    res.status(500).json({ message: 'Erreur récupération des soutenances du jury' });
  }
};
