const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); 

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.warn("⚠️ Aucun token trouvé dans l'en-tête Authorization");
    return res.status(403).json({ error: 'Token manquant' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error(" Token invalide ou expiré :", err.message);
      return res.status(403).json({ error: 'Token invalide ou expiré' });
    }

    console.log("Token décodé :", user);
    req.user = user;
    next();
  });
};





const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Accès refusé. Rôle insuffisant." });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};
