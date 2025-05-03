import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ValidationList.css'; // par exemple

const ValidationList = () => {
  const [memoires, setMemoires] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMemoires = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/memoires/encadreur', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMemoires(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des mémoires:', err);
      setLoading(false);
    }
  };

  const handleValidation = async (id, statut) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/memoires/${id}/validation`, { statut }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMemoires(); // refresh
    } catch (err) {
      console.error('Erreur lors de la validation:', err);
    }
  };

  useEffect(() => {
    fetchMemoires();
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="container">
      <h2>Liste des mémoires à valider</h2>
      {memoires.length === 0 ? (
        <p>Aucun mémoire à afficher.</p>
      ) : (
        <table className="validation-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Description</th>
              <th>Fichier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {memoires.map((memoire) => (
              <tr key={memoire.id}>
                <td>{memoire.titre}</td>
                <td>{memoire.description}</td>
                <td>
                  <a href={`http://localhost:5000/uploads/${memoire.fichier}`} target="_blank" rel="noopener noreferrer">
                    Télécharger
                  </a>
                </td>
                <td>
                  <button onClick={() => handleValidation(memoire.id, 'valide')} className="btn btn-success">Valider</button>
                  <button onClick={() => handleValidation(memoire.id, 'refuse')} className="btn btn-danger">Refuser</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ValidationList;
