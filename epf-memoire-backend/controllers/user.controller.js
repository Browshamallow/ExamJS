const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
  }

  if (!['admin', 'encadreur'].includes(role)) {
    return res.status(400).json({ message: 'Rôle invalide.' });
  }

  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ message: `${role === 'admin' ? 'Administrateur' : 'Encadreur'} créé avec succès.` });
  } catch (error) {
    console.error('Erreur création utilisateur :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getEtudiants = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT id, name FROM users WHERE role = 'etudiant'`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur récupération étudiants' });
  }
};

const getEncadreurs = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT id, name FROM users WHERE role = 'encadreur'`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur récupération encadreurs' });
  }
};

const getUsers = async (req, res) => {
  const { role } = req.query;
  try {
    let query = 'SELECT id, name, email, role FROM users';
    const params = [];

    if (role) {
      query += ' WHERE role = ?';
      params.push(role);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur récupération utilisateurs' });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  if (parseInt(userId) === req.user.id) {
    return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte.' });
  }

  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur suppression utilisateur :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
  }

  if (!['admin', 'encadreur', 'etudiant'].includes(role)) {
    return res.status(400).json({ message: 'Rôle invalide.' });
  }

  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé par un autre utilisateur.' });
    }

    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      [name, email, role, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.json({ message: 'Utilisateur mis à jour.' });
  } catch (error) {
    console.error('Erreur mise à jour utilisateur :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


module.exports = {
  createUser,
  getEtudiants,
  getEncadreurs,
  getUsers,
  deleteUser,
  updateUser,
};
