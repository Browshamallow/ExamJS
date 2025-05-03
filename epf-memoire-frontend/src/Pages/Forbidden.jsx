// src/pages/Forbidden.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Forbidden.css'; // fichier CSS à créer

const Forbidden = () => {
  return (
    <div className="forbidden-container">
      <h1 className="forbidden-title">403 - Accès refusé</h1>
      <p className="forbidden-message">
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
      </p>
      <Link to="/" className="btn-retour">Retour à l'accueil</Link>
    </div>
  );
};

export default Forbidden;
