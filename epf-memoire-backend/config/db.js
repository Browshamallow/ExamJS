const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'memory_manager',
  });
  
  module.exports = pool;


