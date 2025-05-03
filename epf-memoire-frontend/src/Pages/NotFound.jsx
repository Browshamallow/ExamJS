// src/pages/NotFound.jsx
import React from 'react';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 - Page non trouvée</h1>
      <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <a href="/" className="btn-retour">Retour à l'accueil</a>
    </div>
  );
};

export default NotFound;
