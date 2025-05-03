const bcrypt = require('bcryptjs');
const pool = require('./config/db');

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash('motdepasseadmin', 10);

  await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    ['Admin', 'admin@epf.africa', hashedPassword, 'admin']
  );

  console.log('✅ Admin créé avec succès.');
  process.exit();
};

createAdmin().catch((err) => {
  console.error('❌ Erreur création admin :', err);
});
