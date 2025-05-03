import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SupervisorSelection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';

const SupervisorSelection = () => {
  const [encadreurs, setEncadreurs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEncadreurs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/encadreurs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEncadreurs(res.data);
      } catch (err) {
        console.error('Erreur lors du chargement des encadreurs :', err);
      }
    };

    fetchEncadreurs();
  }, []);

  const handleSelect = (id) => {
    setSelectedId(id);
    setMessage('');
  };

  const handleSubmit = async () => {
    if (!selectedId) {
      setMessage('Veuillez sélectionner un encadreur.');
      return;
    }

    const selectedEncadreur = encadreurs.find(e => e.id === selectedId);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/encadrements',
        { encadreurId: selectedId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Sauvegarder dans localStorage
      localStorage.setItem('encadreur_id', selectedId);
      localStorage.setItem('encadreur_name', selectedEncadreur?.name || '');

      setMessage('Encadreur sélectionné avec succès !');
    } catch (error) {
      console.error(error);
      setMessage("Vous avez déjà sélectionné un encadreur.");
    }
  };

  return (
    <div className="supervisor-selection-container">
      <h2>Choisir un Encadreur</h2>

      <div className="encadreur-list">
        {Array.isArray(encadreurs) && encadreurs.length > 0 ? (
          encadreurs.map((encadreur) => (
            <div
              key={encadreur.id}
              className={`encadreur-card ${selectedId === encadreur.id ? 'selected' : ''}`}
              onClick={() => handleSelect(encadreur.id)}
            >
              <FontAwesomeIcon icon={faUserTie} className="encadreur-icon" />
              <div className="encadreur-name">{encadreur.name}</div>
            </div>
          ))
        ) : (
          <p>Aucun encadreur disponible.</p>
        )}
      </div>

      <button className="submit-button" onClick={handleSubmit}>
        Valider le choix
      </button>

      {message && <p style={{ textAlign: 'center', marginTop: '1rem', color: '#880e4f' }}>{message}</p>}
    </div>
  );
};

export default SupervisorSelection;
