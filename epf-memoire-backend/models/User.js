const db = require('../config/db');

const findByEmail = (email, callback) => {
  db.query('SELECT * FROM users WHERE email = ?', [email], callback);
};

const createUser = (name, email, password, role, callback) => {
    db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role],
      callback
    );
  };
  

module.exports = { findByEmail, createUser };
